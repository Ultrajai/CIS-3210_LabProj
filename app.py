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

# data
Users = []
UserFavourites = []

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

@app.route('/getOneBusiness', methods = ['POST'])
def OneBusiness(name=None):
    if request.method == 'POST':
        req = json.loads(json.dumps(request.get_json()))
        return jsonify(GetOneBusi(API_KEY, req['ID']))

@app.route('/getfavourite', methods = ['POST'])
def getfavourite(name=None):
    if request.method == 'POST':
        userPass = json.loads(json.dumps(request.get_json()))

        results = list(filter(lambda item: item['username'] == userPass['username'], UserFavourites))

        print(results)

        message = 'Get favourites!'
        return jsonify(message = message, ids = results)

@app.route('/favourite', methods = ['POST', 'DELETE'])
def favourite(name=None):
    if request.method == 'POST':
        userPass = json.loads(json.dumps(request.get_json()))

        if session['logged_in']:
            UserFavourites.append({'username': session['username'], 'id': userPass['storeID']})
            message = 'added to favourites!'
            return jsonify(message)
        else:
            message = 'Not Logged in to add favourites'
            return jsonify(message)
    elif request.method == 'DELETE':
        userPass = json.loads(json.dumps(request.get_json()))

        UserFavourites.remove({'username': session['username'], 'id': userPass['storeID']})

        print(UserFavourites)

        message = 'removed from favourites!'
        return jsonify(message)


@app.route('/user', methods = ['DELETE', 'POST', 'GET'])
def Login(name=None):
    if request.method == 'POST':
        userPass = json.loads(json.dumps(request.get_json()))
        message= ''

        if {'username': userPass['username'], 'password': userPass['password']} not in Users:
            Users.append({'username': userPass['username'], 'password': userPass['password']})

        if {'username' : userPass['username'], 'password': userPass['password']} in Users:

            results = list(filter(lambda item: item['username'] == userPass['username'], Users))

            if results[0]['password'] != userPass['password']:
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


        return jsonify(message = message, error = 0)
    elif request.method == 'DELETE':
        session.pop('username', None)
        session['logged_in'] = False
        session.clear()
        message = 'Logged out!'
        return jsonify(message)
    elif request.method == 'GET':
        message = 'got users!'
        return jsonify(message = message, users = Users)
