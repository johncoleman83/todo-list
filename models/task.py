#!/usr/bin/env python3
"""
Task Class from Models Module
"""
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
