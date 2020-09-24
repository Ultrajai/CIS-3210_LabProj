#!/usr/local/bin/python

from flask import Flask, render_template, request

app = Flask(__name__, static_url_path='')
#app.debug = True


@app.route('/')
def index(name=None):
    return render_template('index.html', name=name)

@app.route('/user', methods = ['GET', 'POST', 'PUT', 'DELETE'])
def login():
    if request.method == 'POST':
        return ('Trying to POST user!', 200)
    elif request.method == 'PUT':
        return  ('Trying to PUT user!', 200)
    elif request.method == 'DELETE':
        return  ('Trying to DELETE user!', 200)
    else:
        return ('Trying to GET user!', 200)
