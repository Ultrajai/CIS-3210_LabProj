#!/usr/local/bin/python

from flask import Flask, render_template, request, jsonify
import MySQLdb
import json

app = Flask(__name__, static_url_path='')
#app.debug = True

def get_db():
    db = MySQLdb.connect(host="dursley.socs.uoguelph.ca",
                     user="ajai",
                     passwd="1015577",
                     db="ajai")
    return db

# establishes db connection and gets a cursor to start accepting inputs
db = get_db()
cursor = db.cursor()

#set up user table so that we can store users in database
cursor.execute("drop table Users;")
cursor.execute("create table Users (name VARCHAR(255), password VARCHAR(255));")
#cursor.execute("insert into Users values ('asd', 'asd');")

@app.route('/')
def index(name=None):
    return render_template('index.html', name=name)

@app.route('/user', methods = ['GET', 'POST', 'PUT', 'DELETE'])
def login():
    if request.method == 'POST':
        #got to change the json object to string then convert that into a dictionary
        userPass = json.loads(json.dumps(request.get_json()))
        #cursor.execute("insert into Users values (%s, %s);", (userPass['username'], userPass['password']))
        message = 'Trying to create a new user!'
        return jsonify(message)
    elif request.method == 'PUT':
        message = 'Trying to create or replace a user!'
        return jsonify(message)
    elif request.method == 'DELETE':
        message = 'Trying to delete user!'
        return jsonify(message)
    else:
        message = 'Trying to get a user!'
        return jsonify(message)
