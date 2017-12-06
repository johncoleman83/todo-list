#!/usr/bin/env python3
"""
Flask App for Todo List MVP
"""
from datetime import datetime
from flask import abort, Flask, jsonify
from flask import render_template, request, url_for
import json
import requests
from uuid import uuid4

PORT = 5001
HOST = '0.0.0.0'

# flask setup
app = Flask(__name__)
app.url_map.strict_slashes = False


@app.route('/', methods=['GET'])
def main_index():
    """
    handles request to main index.html
    """
    if request.method == 'GET':
        cache_id = uuid4()
        return render_template('index.html', cache_id=cache_id)


@app.errorhandler(404)
def page_not_found(error):
    cache_id = uuid4()
    return render_template('404.html', cache_id=cache_id), 404


if __name__ == "__main__":
    """
    MAIN Flask App
    """
    app.run(host=HOST, port=PORT)
