#!/usr/bin/env python3
"""
User Class from Models Module
"""
from cryptography.fernet import Fernet
import hashlib
import models
from models.base_model import BaseModel, Base
from models.secrets import CIPHER
from sqlalchemy.orm import relationship
from sqlalchemy import Column, String, ForeignKey
from uuid import uuid4


class User(BaseModel, Base):
    """
    User class handles all application users
    """
    __tablename__ = 'users'
    email = Column(String(128), nullable=False)
    fbid = Column(String(128), nullable=False)
    name = Column(String(128), nullable=False)
    photo = Column(String(512), nullable=False)
    tasks = relationship('Task', backref='task', cascade='delete')

    def __init__(self, *args, **kwargs):
        """
        instantiates user object
        """
        REQUIRED = models.REQUIRED
        if kwargs:
            for req in REQUIRED:
                if req not in kwargs:
                    return None
            for key, val in kwargs.items():
                kwargs[key] = User.text_encrypt(val)
            super().__init__(*args, **kwargs)

    def text_encrypt(text):
        """
        encrypts input to encypted string
        """
        text_bytes = text.encode('utf-8')
        encrypted_bytes = CIPHER.encrypt(text_bytes)
        encrypted_string = encrypted_bytes.decode('utf-8')
        return encrypted_string

    def text_decrypt(text):
        """
        encrypts input to encypted string
        """
        text_bytes = text.encode('utf-8')
        decrypted_bytes = CIPHER.decrypt(text_bytes)
        decrypted_string = decrypted_bytes.decode('utf-8')
        return decrypted_string
