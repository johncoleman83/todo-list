from models.base_model import BaseModel
from models.user import User
from models.task import Task
from models.engine import db_storage

PORT = 5001
HOST = '0.0.0.0'
REQUIRED = ['email', 'name', 'photo', 'fbid']
CNC = db_storage.DBStorage.CNC
storage = db_storage.DBStorage()
storage.reload()
