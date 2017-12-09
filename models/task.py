#!/usr/bin/env python3
"""
Task Class from Models Module
"""
import models
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, ForeignKey


class Task(BaseModel, Base):
    """
    Task Class handles all application Tasks
    """
    __tablename__ = 'tasks'
    user_id = Column(String(60), ForeignKey('users.id'), nullable=False)
    text = Column(String(512), nullable=False)
    color = Column(String(16), nullable=True)
    dateLabel = Column(String(16), nullable=True)
    date = Column(String(16), nullable=True)
    time = Column(String(16), nullable=True)
    labelClass = Column(String(16), nullable=False)

    def __init__(self, *args, **kwargs):
        """
        instantiates a new Task
        """
        if kwargs:
            u_id = kwargs.get('user_id', None)
            if u_id is None:
                raise ValueError
            else:
                u_object = models.storage.get("User", u_id)
                if u_object is None:
                    raise ValueError
                key = "{}.{}".format("User", u_id)
                user = u_object.get(key)
                if len(user.tasks) > 50:
                    raise ValueError
            super().__init__(*args, **kwargs)
