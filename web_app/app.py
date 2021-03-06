#!/usr/bin/env python3
"""
Flask App for Todo List MVP
"""
from datetime import datetime
from flask import abort, Flask, jsonify
from flask import render_template, request, url_for
from flask_cors import CORS, cross_origin
import json
from models import storage, Task, User, REQUIRED, APP_PORT, APP_HOST
from models.secrets import API_BEARER_TOKEN
import requests
from uuid import uuid4


# flask setup
app = Flask(__name__)
app.testing = True
app.url_map.strict_slashes = False
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
ERRORS = [
    "Not a JSON", "Missing required information",
    "No tasks saved yet, please save a todo task",
    "Wrong id type", "Missing required user information",
    "not an authenticated request"
]


def api_response(state, message, code):
    """
    Method to handle errors with api
    """
    time = str(datetime.utcnow())[11:19]
    data = "{} {}".format(message, time)
    response = {state: data, "status_code": code}
    resp_json = jsonify(response)
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
        token = User.text_encrypt(API_BEARER_TOKEN)
        return render_template('index.html', token=token, cache_id=cache_id)


def make_todo_list(verified_user):
    """
    makes JSON todo list for client
    """
    todo_list = {}
    todo_list['userInfo'] = verified_user.to_json()
    all_tasks = todo_list['userInfo'].pop('tasks')
    return all_tasks


@app.route('/api/<fbid>/<token>', methods=['GET'])
def api_get_handler(fbid=None, token=None):
    """
    handles api get requests
    """
    if fbid is None or token is None:
        return api_response("error", ERRORS[2], 401)
    verified_user = storage.get_user_by_fbid(fbid)
    if verified_user is None:
        return api_response("error", ERRORS[2], 401)
    try:
        encrypted_token = User.text_decrypt(token)
    except Exception as e:
        return api_response("error", str(e), 401)
    if encrypted_token != API_BEARER_TOKEN:
        return api_response("error", ERRORS[5], 401)
    all_tasks = make_todo_list(verified_user)
    return jsonify(all_tasks), 201


def initialize_new_task_list(user_info, all_tasks):
    """
    initializes new task and user from POST request
    """
    new_user = User(**user_info)
    new_user.save()
    user_id = new_user.id
    for task in all_tasks.values():
        task['user_id'] = user_id
        new_task = Task(**task)
        new_task.save()
    return "new user and tasks created"


def update_user_tasks(verified_user, all_tasks):
    """
    updates user task information
    """
    user_id = verified_user.id
    db_user_tasks = verified_user.tasks
    db_user_task_ids = set([task.id for task in db_user_tasks])
    for task_id, task in all_tasks.items():
        if task_id in db_user_task_ids:
            db_user_task_ids.remove(task_id)
            task_to_update = storage.get("Task", task_id)
            key = "{}.{}".format("Task", task_id)
            value = task_to_update.get(key)
            value.bm_update(task)
        else:
            task['user_id'] = user_id
            new_task = Task(**task)
            new_task.save()
    if len(db_user_task_ids) > 0:
        for task_id in db_user_task_ids:
            task_to_delete = storage.get("Task", task_id)
            key = "{}.{}".format("Task", task_id)
            value = task_to_delete.get(key)
            value.delete()
    return "tasks updated"


def verify_proper_post_request(req_data):
    """
    verifies that proper request has been made
    """
    if req_data is None:
        return 0
    user_info = req_data.get('userInfo', None)
    if user_info is None:
        return 1
    token = req_data.get('token')
    if token is None:
        return 5
    try:
        encrypted_token = User.text_decrypt(token)
    except Exception as e:
        return 5
    if encrypted_token != API_BEARER_TOKEN:
        return 5
    fbid = user_info.get('fbid', None)
    if fbid is None:
        return 2
    if type(fbid) == 'int':
        return 3
    for attr in REQUIRED:
        if attr not in user_info:
            return 4
    return fbid


@app.route('/api', methods=['POST'])
def api_post_handler():
    """
    handles api post requests
    """
    req_data = request.get_json()
    verification = verify_proper_post_request(req_data)
    if type(verification).__name__ == "int":
        return api_response("error", ERRORS[verification], 400)
    user_info = req_data.get('userInfo', None)
    all_tasks = req_data.get('allTasks', None)
    if user_info is None or all_tasks is None:
        return api_response("error", ERRORS[1], 400)
    for req in REQUIRED:
        if req not in user_info:
            return api_response("error", ERRORS[1], 400)
    verified_user = storage.get_user_by_fbid(verification)
    if verified_user is None:
        message = initialize_new_task_list(user_info, all_tasks)
        return api_response("success", message, 200)
    else:
        message = update_user_tasks(verified_user, all_tasks)
        return api_response("success", message, 200)


@app.errorhandler(404)
def page_not_found(error):
    """
    404 page error handler
    """
    cache_id = uuid4()
    return render_template('404.html', cache_id=cache_id), 404


if __name__ == "__main__":
    """
    MAIN Flask App
    """
    app.run(host=APP_HOST, port=APP_PORT)
