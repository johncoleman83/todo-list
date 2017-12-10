#!/usr/bin/env python3
"""
stores mysql DB secrets, should be kept secret for production
"""
from cryptography.fernet import Fernet
import os
import sys

KEY = os.getenv('TODO_KEY', '1OWU3m77xWS5r_CfcQ63mRlyQDvR3VEfud4Img8psVE=')
TODO_KEY = KEY.encode('utf-8')
CIPHER = Fernet(KEY)
TODO_USER = os.getenv('TODO_USER', 'root')
TODO_PWD = os.getenv('TODO_DB_PWD', '')
TODO_DB_HOST = os.getenv('TODO_DB_HOST', None)
if TODO_DB_HOST is None:
    print("Usage:", file=sys.stderr)
    print("$ TODO_DB_HOST=[YOUR IP ADDRESS] python3 -m web_app.app",
          file=sys.stderr)
    print("Please specify the env variable TODO_DB_HOST", file=sys.stderr)
    exit 1
TODO_MYSQL_DB = os.getenv('TODO_MYSQL_DB', 'todo_dev_db')
