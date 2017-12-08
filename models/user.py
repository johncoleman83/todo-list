#!/usr/bin/python3
"""
User Class from Models Module
"""
import hashlib
import models
from models.base_model import BaseModel, Base
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
        REQUIRED = ['email', 'name', 'photo', 'fbid']
        if kwargs:
            for req in REQUIRED:
                if req not in kwargs:
                    return None
            for key, val in kwargs.items():
                kwargs[key] = User.__word_hash_encrypt(val)
            super().__init__(*args, **kwargs)

    def __word_hash_encrypt(word):
        """
        encrypts input to encypted string
        """
        secure = hashlib.md5()
        secure.update(word.encode("utf-8"))
        secure_word = secure.hexdigest()
        return secure_word
