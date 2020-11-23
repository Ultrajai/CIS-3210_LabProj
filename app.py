#!/usr/local/bin/python

from flask import Flask, render_template, request, jsonify, session
import MySQLdb
import json
import requests
import urllib
from urllib.error import HTTPError
from urllib.parse import quote
from urllib.parse import urlencode

app = Flask(__name__, static_url_path='')
#app.debug = True

# API setup
API_KEY = 'fqJRlsBmI6HNhF9Jdjb3TY3Afw8VeJNiKCHqbURuEKh2NiK1u3WL2sOjzd23oUBzjsMWmN-lbWVMF2fMV7tbxbyktY5HVxFJbLgK5iXqDEXhWLNGN6psmvg50BKOX3Yx'
API_HOST = 'https://api.yelp.com'
SEARCH_PATH = '/v3/businesses/search'

# shhh my secret key
app.secret_key = b'\x98!\x83G\xd9\xea\x9d\xb1$p\xb9\xec\xee0AJ'
app.config['SESSION_COOKIE_SAMESITE'] = "Lax"

# establishes db connection and gets a cursor to start accepting inputs
db = MySQLdb.connect(host="dursley.socs.uoguelph.ca",
                 user="ajai",
                 passwd="1015577",
                 db="ajai")
c = db.cursor()

# initialize the user table
c.execute("DROP TABLE Users;")
db.commit()
c.execute("DROP TABLE UserFavourites;")
db.commit()
c.execute("CREATE TABLE Users (username VARCHAR(255) NOT NULL PRIMARY KEY, password VARCHAR(255) NOT NULL);")
db.commit()
c.execute("CREATE TABLE UserFavourites (username VARCHAR(255) NOT NULL, favStoreID VARCHAR(255) NOT NULL);")
db.commit()

c.close()
db.close()

def RequestData(host, path, api_key, url_params=None):
    url_params = url_params or {}
    url = '{0}{1}'.format(host, quote(path.encode('utf8')))
    headers = {
        'Authorization': 'Bearer %s' % api_key,
    }

    print(u'Querying {0} ...'.format(url))

    response = requests.request('GET', url, headers=headers, params=url_params)

    return response.json()

def SearchBusinesses(api_key, location, limit):
    url_params = {
        'location': location.replace(' ', '+'),
        'limit': limit
    }

    return RequestData(API_HOST, SEARCH_PATH, api_key, url_params=url_params)

def GetReviews(api_key, businessID):
    path = '/v3/businesses/'
    path += businessID
    path += '/reviews'
    return RequestData(API_HOST, path, api_key)

def GetOneBusi(api_key, businessID):
    path = '/v3/businesses/'
    path += businessID
    return RequestData(API_HOST, path, api_key)

@app.route('/')
def Index(name=None):
    return render_template('index.html', name=name)

@app.route('/userDirectory')
def Directory(name=None):
    return render_template('userDirectory.html', name=name)

@app.route('/getBusinesses', methods = ['POST'])
def GetBusinesses(name=None):
    if request.method == 'POST':
        req = json.loads(json.dumps(request.get_json()))
        return jsonify(SearchBusinesses(API_KEY, req['location'], req['limit']))

@app.route('/getReviews', methods = ['POST'])
def Reviews(name=None):
    if request.method == 'POST':
        req = json.loads(json.dumps(request.get_json()))
        return jsonify(GetReviews(API_KEY, req['ID']))

@app.route('/getOtherLikedLocations', methods = ['POST'])
def OtherLikedLocations(name=None):
    if request.method == 'POST':
        req = json.loads(json.dumps(request.get_json()))
        IDs = []

        db = MySQLdb.connect(host="dursley.socs.uoguelph.ca",
                         user="ajai",
                         passwd="1015577",
                         db="ajai")
        c = db.cursor()

        error = c.execute('SELECT username FROM UserFavourites WHERE favStoreID = %s', (req['ID'],))
        results = c.fetchall()

        for username in results:
            error = c.execute('SELECT favStoreID FROM UserFavourites WHERE username = %s', (username[0],))
            locationIDs = c.fetchall()
            IDs.extend(locationIDs)

        c.close()
        db.close()

        return jsonify(ids = IDs)

@app.route('/getOneBusiness', methods = ['POST'])
def OneBusiness(name=None):
    if request.method == 'POST':
        req = json.loads(json.dumps(request.get_json()))
        return jsonify(GetOneBusi(API_KEY, req['ID']))

@app.route('/favourite', methods = ['PUT', 'POST', 'DELETE'])
def favourite(name=None):
    if request.method == 'POST':
        userPass = json.loads(json.dumps(request.get_json()))

        if session.get('logged_in'):
            db = MySQLdb.connect(host="dursley.socs.uoguelph.ca",
                             user="ajai",
                             passwd="1015577",
                             db="ajai")
            c = db.cursor()
            error = c.execute('INSERT INTO UserFavourites VALUES (%s, %s)', (session['username'], userPass['storeID']))
            db.commit()
            c.close()
            db.close()
            message = 'added to favourites!'
            return jsonify(message)
        else:
            message = 'Not Logged in to add favourites'
            return jsonify(message)


    elif request.method == 'DELETE':
        userPass = json.loads(json.dumps(request.get_json()))

        if session.get('logged_in'):
            db = MySQLdb.connect(host="dursley.socs.uoguelph.ca",
                             user="ajai",
                             passwd="1015577",
                             db="ajai")
            c = db.cursor()
            error = c.execute('DELETE FROM UserFavourites WHERE username = %s AND favStoreID = %s', (session['username'], userPass['storeID']))
            db.commit()
            c.close()
            db.close()

            message = 'removed from favourites!'
            return jsonify(message)
        else:
            message = 'Not Logged in to remove favourites'
            return jsonify(message)

    elif request.method == 'PUT':
        userPass = json.loads(json.dumps(request.get_json()))
        db = MySQLdb.connect(host="dursley.socs.uoguelph.ca",
                         user="ajai",
                         passwd="1015577",
                         db="ajai")
        c = db.cursor()
        error = c.execute('SELECT favStoreID FROM UserFavourites WHERE username = %s', (userPass['username'],))
        results = c.fetchall()
        c.close()
        db.close()

        message = 'Get favourites!'
        return jsonify(message = message, ids = results)

@app.route('/user', methods = ['DELETE', 'POST', 'GET'])
def Login(name=None):
    if request.method == 'POST':
        userPass = json.loads(json.dumps(request.get_json()))
        db = MySQLdb.connect(host="dursley.socs.uoguelph.ca",
                         user="ajai",
                         passwd="1015577",
                         db="ajai")
        c = db.cursor()

        error = c.execute('INSERT IGNORE INTO Users VALUES (%s, %s)', (userPass['username'], userPass['password']))
        db.commit()

        if error == 0:
            error = c.execute('SELECT * FROM Users WHERE username = %s AND password = %s', (userPass['username'], userPass['password']))

            if error == 0:
                message = "Error: Couldn't sign in due to bad password"
                return jsonify(message = message, error = 1)
            else:
                message = "signed in!"
                session['username'] = userPass['username']
                session['logged_in'] = True
        else:
            message = 'created a new user!'
            session['username'] = userPass['username']
            session['logged_in'] = True

        c.close()
        db.close()

        return jsonify(message = message, error = 0)
    elif request.method == 'DELETE':
        session.pop('username', None)
        session['logged_in'] = False
        session.clear()
        message = 'Logged out!'
        return jsonify(message)
    elif request.method == 'GET':
        db = MySQLdb.connect(host="dursley.socs.uoguelph.ca",
                         user="ajai",
                         passwd="1015577",
                         db="ajai")
        c = db.cursor()

        error = c.execute('SELECT username FROM Users')
        results = c.fetchall()

        c.close()
        db.close()

        message = 'got users!'
        return jsonify(message = message, users = results)
