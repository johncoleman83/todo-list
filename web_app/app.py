#!/usr/bin/env python3
"""
Flask App for Todo List MVP
"""
from flask import abort, Flask, jsonify
from flask import render_template, request, url_for
import json
from models import storage, Task, User
import requests
from uuid import uuid4


# flask setup
app = Flask(__name__)
app.url_map.strict_slashes = False
port = 5001
host = 'localhost'
REQUIRED = ['email', 'name', 'photo', 'fbid']

def api_error(message, code):
    """
    Method to handle errors with api
    """
    response = { "error": message, "status_code": code }
    resp_json = jsonify(message)
    return resp_json

@app.teardown_appcontext
def teardown_db(exception):
    """
    after each request, this method calls .close() (i.e. .remove()) on
    the current SQLAlchemy Session
    """
    storage.close()

@app.route('/', methods=['GET'])
def main_index():
    """
    handles request to main index.html
    """
    if request.method == 'GET':
        cache_id = uuid4()
        return render_template('index.html', cache_id=cache_id)

@app.route('/api', methods=['GET', 'POST'])
def api_handler():
    """
    handles request to main index.html
    """
    if request.method == 'GET':
        req_data = request.get_json()
        if req_data is None:
            return api_error("Not a JSON", 404)
        fbid = req_data.get('fbid', None)
        if fbid is None:
            return api_error("Missing id", 400)
        secure_fbid = User.__word_hash_encrypt(fbid)
        all_users = storage.all('User').values()
        verified_user = None
        for user in all_users:
            this_fbid = user.get('fbid')
            if this_fbid == secure_fbid:
                verified_user = user
                break
        if verified_user is None:
            return api_error("Unknown id", 400)
        return jsonify({"status": "success"}), 200

    if request.method == 'POST':
        req_data = request.get_json()
        print(type(req_data))
        return jsonify({"status": "success"}), 200
        if req_data is None:
            return api_error("Not a JSON", 404)
        for req in REQUIRED:
            if req not in req_data:
                return api_error("Missing attribute", 400)
        fbid = req_data.get('fbid', None)
        if fbid is None:
            return api_error("Missing id", 400)
        secure_fbid = User.__word_hash_encrypt(fbid)
        all_users = storage.all('User').values()
        verified_user = None
        for user in all_users:
            this_fbid = user.get('fbid')
            if this_fbid == secure_fbid:
                verified_user = user
                break
        if verified_user is None:
            # create new User and Tasks
            pass
        else:
            # update User and Tasks
            pass

@app.errorhandler(404)
def page_not_found(error):
    cache_id = uuid4()
    return render_template('404.html', cache_id=cache_id), 404


if __name__ == "__main__":
    """
    MAIN Flask App
    """
    app.run(host=host, port=port)
