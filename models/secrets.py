#!/usr/bin/env python3
"""
stores mysql DB secrets, should be kept secret for production
"""
from cryptography.fernet import Fernet
import os
import sys

MY_API_TOKEN = (
    "bCCHjJ4CddOvuz&Yoce4^hpQqSr5393LtxF8#Dlv@a*O0MXlp8sdwQI%LwYlPAB*cNbVV9EUG"
    "lDsAkwPpcBeQ$F0A1Tdtnf%9eEe"
)

KEY = os.getenv('TODO_KEY', '1OWU3m77xWS5r_CfcQ63mRlyQDvR3VEfud4Img8psVE=')
API_BEARER_TOKEN = os.getenv('API_TOKEN', MY_API_TOKEN)
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
    sys.exit(1)
TODO_MYSQL_DB = os.getenv('TODO_MYSQL_DB', 'todo_dev_db')
