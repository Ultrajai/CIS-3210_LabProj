#!/usr/local/bin/python

from flask import Flask, render_template, request, jsonify
import MySQLdb
import json

app = Flask(__name__, static_url_path='')
#app.debug = True

sessionCount = 0
sessionList = []

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


@app.route('/user', methods = ['GET', 'POST', 'PUT', 'DELETE'])
def login():
    global sessionCount
    if request.method == 'POST':
        userPass = json.loads(json.dumps(request.get_json()))

        error = c.execute('INSERT IGNORE INTO Users VALUES (%s, %s)', (userPass['username'], userPass['password']))
        db.commit()

        if error == 0:
            message = "This username is already being used by someone else pick another one..."
        else:
            message = 'created a new user!'

        return jsonify(message)
    elif request.method == 'PUT':
        passwordReplaceRequest = json.loads(json.dumps(request.get_json()))

        error = c.execute('UPDATE Users SET password = %s WHERE username = %s AND password = %s;', (passwordReplaceRequest['newPassword'], passwordReplaceRequest['username'], passwordReplaceRequest['oldPassword']))
        db.commit()

        if error == 0:
            message = "Failed to update your password make sure your username and old password are correct"
        else:
            message = "Replaced a user's password!"
        return jsonify(message)
    elif request.method == 'DELETE':
        userPass = json.loads(json.dumps(request.get_json()))

        error = c.execute('DELETE FROM Users WHERE username = %s AND password = %s;', (userPass['username'], userPass['password']))
        db.commit()

        if error == 0:
            message = "Did not delete a user due to bad input or the account not existing in the first place"
        else:
            message = 'deleted a user!'


        return jsonify(message)
    else:
        error = c.execute('SELECT * FROM Users;')
        results = c.fetchall()

        if error == 0:
            message = "There are no users in the database"
        else:
            message = "Getting users from database!"

        return jsonify(message = message, results = results)

#this is code I am going to maybe use later
#loginRequest = json.loads(json.dumps(request.get_json()))

#error = c.execute('SELECT * FROM Users WHERE username = %s AND password = %s', (loginRequest['username'], loginRequest['password']))
#db.commit()

# if you already have a login session it wouldn't do anything
#if any(session['sessionID'] == loginRequest['sessionID'] for session in sessionList):
#    message = "You are already logged in!"
#    return jsonify(message = message, sessionID = loginRequest['sessionID'])
#if error == 0: #if there was no user found
#    message = "There is no user with this username or password try to create a user"
#    return jsonify(message = message, sessionID = -1)
#else:
#    message = 'Logged in!'
#    sessionCount += 1
#    sessionList.append({"username": loginRequest['username'], "sessionID": sessionCount})
#    print(sessionList)
#    return jsonify(message = message, sessionID = sessionCount)
