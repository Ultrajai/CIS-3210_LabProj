#!/usr/local/bin/python

from flask import Flask, render_template, request, jsonify, session
import MySQLdb
import json

app = Flask(__name__, static_url_path='')
#app.debug = True

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
c.execute("CREATE TABLE Users (username VARCHAR(255) NOT NULL PRIMARY KEY, password VARCHAR(255) NOT NULL);")
db.commit()


@app.route('/')
def index(name=None):
    return render_template('index.html', name=name)

@app.route('/user', methods = ['DELETE', 'POST'])
def login(name=None):
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
        message = 'Logged out!'
        return jsonify(message)
