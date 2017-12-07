#!/usr/bin/env python3
"""
Flask App for Todo List MVP
"""
from flask import abort, Flask, jsonify
from flask import render_template, request, url_for
import json
#from models import storage
import requests
from uuid import uuid4


# flask setup
app = Flask(__name__)
app.url_map.strict_slashes = False
port = 5001
host = 'localhost'

'''
# begin flask page rendering
@app.teardown_appcontext
def teardown_db(exception):
    """
    after each request, this method calls .close() (i.e. .remove()) on
    the current SQLAlchemy Session
    """
    storage.close()
'''

@app.route('/', methods=['GET', 'POST'])
def main_index(the_id=None):
    """
    handles request to main index.html
    """
    if request.method == 'GET':
        cache_id = uuid4()
        return render_template('index.html', cache_id=cache_id)
    if request.method == 'POST':
        req_data = request.get_json()
        print(req_data)
        return jsonify({"status": "success"}), 200

@app.errorhandler(404)
def page_not_found(error):
    cache_id = uuid4()
    return render_template('404.html', cache_id=cache_id), 404

if __name__ == "__main__":
    """
    MAIN Flask App
    """
    app.run(host=host, port=port)
