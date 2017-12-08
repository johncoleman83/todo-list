#!/usr/bin/env python3
"""
stores mysql DB secrets, should be kept secret for production
"""
from cryptography.fernet import Fernet

KEY = b'1OWU3m77xWS5r_CfcQ63mRlyQDvR3VEfud4Img8psVE='
CIPHER = Fernet(KEY)
USER = 'hbnb_dev'
PW = 'hbnb_dev_pwd'
HOST = 'localhost'
DB = 'todo_list_db'
