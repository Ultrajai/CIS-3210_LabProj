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

"""# establishes db connection and gets a cursor to start accepting inputs
db = MySQLdb.connect(host="dursley.socs.uoguelph.ca",
                 user="ajai",
                 passwd="1015577",
                 db="ajai")
c = db.cursor()

# initialize the user table
c.execute("DROP TABLE Users;")
db.commit()
c.execute("CREATE TABLE Users (username VARCHAR(255) NOT NULL PRIMARY KEY, password VARCHAR(255) NOT NULL);")
db.commit()"""


def RequestData(host, path, api_key, url_params=None):
    """Given your API_KEY, send a GET request to the API.
    Args:
        host (str): The domain host of the API.
        path (str): The path of the API after the domain.
        API_KEY (str): Your API Key.
        url_params (dict): An optional set of query parameters in the request.
    Returns:
        dict: The JSON response from the request.
    Raises:
        HTTPError: An error occurs from the HTTP request.
    """
    url_params = url_params or {}
    url = '{0}{1}'.format(host, quote(path.encode('utf8')))
    headers = {
        'Authorization': 'Bearer %s' % api_key,
    }

    print(u'Querying {0} ...'.format(url))

    response = requests.request('GET', url, headers=headers, params=url_params)

    return response.json()

def SearchBusinesses(api_key, location):
    url_params = {
        'location': location.replace(' ', '+'),
        'limit': 20
    }

    return RequestData(API_HOST, SEARCH_PATH, api_key, url_params=url_params)

@app.route('/')
def Index(name=None):
    return render_template('index.html', name=name)

@app.route('/getBusinesses', methods = ['POST'])
def GetBusinesses(name=None):
    if request.method == 'POST':
        req = json.loads(json.dumps(request.get_json()))
        return jsonify(SearchBusinesses(API_KEY, req['location']))
"""
@app.route('/user', methods = ['DELETE', 'POST'])
def Login(name=None):
    if request.method == 'POST':
        userPass = json.loads(json.dumps(request.get_json()))

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


        return jsonify(message = message, error = 0)
    elif request.method == 'DELETE':
        session.pop('username', None)
        session['logged_in'] = False
        session.clear()
        message = 'Logged out!'
        return jsonify(message)
"""
