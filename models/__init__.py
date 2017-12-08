from models.base_model import BaseModel
from models.user import User
from models.task import Task
from models.engine import db_storage

CNC = db_storage.DBStorage.CNC
storage = db_storage.DBStorage()
storage.reload()
