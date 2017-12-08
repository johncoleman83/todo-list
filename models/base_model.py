#!/usr/bin/python3
"""
BaseModel Class of Models Module
"""

from datetime import datetime
import json
import models
import os
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, DateTime
from uuid import uuid4, UUID


# Creates instance of Base if storage type is a database
Base = declarative_base()

class BaseModel:
    """
    attributes and functions for BaseModel class
    """

    id = Column(String(60), nullable=False, primary_key=True)
    created_at = Column(DateTime, nullable=False,
                        default=datetime.utcnow())

    def __init__(self, *args, **kwargs):
        """
        instantiation of new BaseModel Class
        """
        if kwargs:
            self.__set_attributes(kwargs)
        else:
            self.id = str(uuid4())
            self.created_at = datetime.utcnow()

    def __secure_from_injection(self, text):
        """
        minor security from SQL injections
        """
        REP_CHARS = [';', "'", '"']
        for i in REP_CHARS:
            text = text.replace(i, '#')
        return text

    def __set_attributes(self, attr_dict):
        """
        private: converts attr_dict values to python class attributes
        """
        if 'id' not in attr_dict:
            attr_dict['id'] = str(uuid4())
        if 'created_at' not in attr_dict:
            attr_dict['created_at'] = datetime.utcnow()
        elif self.__is_serializable(attr_dict.get('created_at')):
            attr_dict['created_at'] = datetime.strptime(
                attr_dict['created_at'], "%Y-%m-%d %H:%M:%S.%f"
            )
        attr_dict.pop('__class__', None)
        for attr, val in attr_dict.items():
            if type(val).__name__ == 'str':
                val = self.__secure_from_injection(val)
            setattr(self, attr, val)

    def __is_serializable(self, obj_v):
        """
        private: checks if object is serializable
        """
        try:
            obj_to_str = json.dumps(obj_v)
            return all(obj_to_str is not None,
                       isinstance(obj_to_str, str))
        except:
            return False

    def bm_update(self, attr_dict=None):
        """
        updates the basemodel and sets the correct attributes
        """
        IGNORE = ['id', 'user_id', 'created_at', 'email', 'fbid']
        if attr_dict:
            updated_dict = {
                k: v for k, v in attr_dict.items() if k not in IGNORE
            }
            for key, value in updated_dict.items():
                print(key, value)
                setattr(self, key, value)
            self.save()

    def save(self):
        """
        updates attribute updated_at to current time
        """
        self.updated_at = datetime.utcnow()
        models.storage.new(self)
        models.storage.save()

    def to_json(self, saving_file_storage=False):
        """
        returns json representation of self
        """
        obj_class = self.__class__.__name__
        if obj_class == "User" and self.tasks:
            pass
        bm_dict = {}
        for k, v in self.__dict__.items():
            if v is not None and v != "None":
                bm_dict[k] = v if self.__is_serializable(v) else str(v)
        if 'tasks' in self.__dict__:
            bm_dict['tasks'] = dict([
                [task.id, task.to_json()] for task in self.tasks
            ])
        bm_dict.pop('_sa_instance_state', None)
        return(bm_dict)

    def __str__(self):
        """
        returns string type representation of object instance
        """
        class_name = type(self).__name__
        return '[{}] ({}) {}'.format(class_name, self.id, self.__dict__)

    def delete(self):
        """
        deletes current instance from storage
        """
        models.storage.delete(self)
