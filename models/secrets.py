#!/usr/bin/env python3
"""
stores mysql DB secrets, should be kept secret for production
"""
from cryptography.fernet import Fernet
import os

KEY = os.getenv('TODO_KEY', '1OWU3m77xWS5r_CfcQ63mRlyQDvR3VEfud4Img8psVE=')
TODO_KEY = KEY.encode('utf-8')
CIPHER = Fernet(KEY)
TODO_USER = os.getenv('TODO_USER', 'root')
TODO_PWD = os.getenv('TODO_DB_PWD', '')
TODO_DB_HOST = os.getenv('TODO_DB_HOST', '172.17.0.2')
TODO_MYSQL_DB = os.getenv('TODO_MYSQL_DB', 'todo_dev_db')
