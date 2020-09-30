#!/usr/local/bin/python

from flask import Flask, render_template, request, jsonify
import MySQLdb
import json

app = Flask(__name__, static_url_path='')
#app.debug = True

sessionCount = 0

# establishes db connection and gets a cursor to start accepting inputs
db = MySQLdb.connect(host="dursley.socs.uoguelph.ca",
                 user="ajai",
                 passwd="1015577",
                 db="ajai")
c = db.cursor()

# initialize the user table
c.execute("DROP TABLE Users;")
db.commit()
c.execute("CREATE TABLE Users (username VARCHAR(255) NOT NULL PRIMARY KEY, password VARCHAR(255) NOT NULL);")
db.commit()


@app.route('/')
def index(name=None):
    return render_template('index.html', name=name)

@app.route('/replacePassword')
def replacePassword(name=None):
    return render_template('replacePassword.html', name=name)

@app.route('/createUser', methods = ['POST'])
def createUser():
    if request.method == 'POST':
        userPass = json.loads(json.dumps(request.get_json()))

        error = c.execute('INSERT IGNORE INTO Users VALUES (%s, %s)', (userPass['username'], userPass['password']))
        db.commit()

        if error == 0:
            message = "This username is already being used by someone else pick another one..."
        else:
            message = 'created a new user!'

        return jsonify(message)

@app.route('/user', methods = ['GET', 'POST', 'PUT', 'DELETE'])
def login():
    global sessionCount
    if request.method == 'POST':
        loginRequest = json.loads(json.dumps(request.get_json()))

        error = c.execute('SELECT * FROM Users WHERE username = %s AND password = %s', (loginRequest['username'], loginRequest['password']))
        db.commit()

        if error == 0:
            message = "There is no user with this username or password try to create a user"
        else:
            message = 'Logged in!'

        sessionCount += 1

        return jsonify(message = message, sessionID = sessionCount)
    elif request.method == 'PUT':
        passwordReplaceRequest = json.loads(json.dumps(request.get_json()))

        error = c.execute('UPDATE Users SET password = %s WHERE username = %s AND password = %s;', (passwordReplaceRequest['newPassword'], passwordReplaceRequest['username'], passwordReplaceRequest['oldPassword']))
        db.commit()

        if error == 0:
            message = "Failed to update your password make sure you username and old password are correct"
        else:
            message = "Replaced a user's password!"
        return jsonify(message)
    elif request.method == 'DELETE':
        message = 'Trying to delete user!'
        return jsonify(message)
    else:
        message = 'Trying to get a user!'
        return jsonify(message)
