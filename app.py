#!/usr/local/bin/python

from flask import Flask, render_template, request, jsonify

app = Flask(__name__, static_url_path='')
#app.debug = True


@app.route('/')
def index(name=None):
    return render_template('index.html', name=name)

@app.route('/user', methods = ['GET', 'POST', 'PUT', 'DELETE'])
def login():
    if request.method == 'POST':
        print('recieved a POST request!')
        message = 'Trying to POST user!'
        return jsonify(message)
    elif request.method == 'PUT':
        print('recieved a PUT request!')
        message = 'Trying to PUT user!'
        return jsonify(message)
    elif request.method == 'DELETE':
        print('recieved a DELETE request!')
        message = 'Trying to DELETE user!'
        return jsonify(message)
    else:
        print('recieved a GET request!')
        message = 'Trying to GET user!'
        return jsonify(message)
