#!/usr/bin/python3
"""
Database storage engine
"""
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker, scoped_session
from models.base_model import Base
from models import base_model, task
from models.user import User
from models.secrets import TODO_USER, TODO_PWD, TODO_DB_HOST, TODO_MYSQL_DB


class DBStorage:
    """
    handles long term storage of all class instances
    """
    CNC = {
        'Task': task.Task,
        'User': User,
    }
    __engine = None
    __session = None

    def __init__(self):
        """
        creates the engine self.__engine
        """
        if TODO_PWD != '':
            PWD = "{}{}".format(":", TODO_PWD)
        else:
            PWD = TODO_PWD
        self.__engine = create_engine(
            'mysql+pymysql://{}{}@{}:3306/{}'
            .format(TODO_USER, PWD, TODO_DB_HOST, TODO_MYSQL_DB)
        )

    def verify_tables(self, cls):
        """
        verifies if the db has initialized or noe
        """
        tables = {"User": "users", "Task": "tasks"}
        if cls is None:
            return False
        if not self.__engine.dialect.has_table(self.__engine, tables[cls]):
            return False
        return True

    def all(self, cls=None):
        """
        returns a dictionary of all objects
        """
        if not self.verify_tables(cls):
            return {}
        obj_dict = {}
        if cls is not None:
            a_query = self.__session.query(DBStorage.CNC[cls])
            for obj in a_query:
                obj_ref = "{}.{}".format(type(obj).__name__, obj.id)
                if cls == 'User' and obj.tasks:
                    pass
                obj_dict[obj_ref] = obj
            return obj_dict

        for c in DBStorage.CNC.values():
            a_query = self.__session.query(c)
            for obj in a_query:
                obj_ref = "{}.{}".format(type(obj).__name__, obj.id)
                if type(c).__name__ == 'User' and obj.tasks:
                    pass
                obj_dict[obj_ref] = obj
        return obj_dict

    def new(self, obj):
        """
        adds objects to current database session
        """
        self.__session.add(obj)

    def save(self):
        """
        commits all changes of current database session
        """
        self.__session.commit()

    def rollback_session(self):
        """
        rollsback a session in the event of an exception
        """
        self.__session.rollback()

    def get_user_by_fbid(self, fbid=None):
        """
        retrieves one user object
        """
        if fbid:
            if not self.verify_tables("User"):
                return None
            a_query = self.__session.query(User)
            for user in a_query:
                if User.text_decrypt(user.fbid) == fbid:
                    return user
        return None

    def get(self, obj_cls=None, obj_id=None):
        """
        retrieves one object based on class name and id
        """
        if not self.verify_tables(obj_cls):
            return {}
        these_objs = {}
        if obj_cls and obj_id:
            a_query = (self.__session.query(DBStorage.CNC[obj_cls])
                       .filter(DBStorage.CNC[obj_cls].id == obj_id))
            for obj in a_query:
                val = "{}.{}".format(type(obj).__name__, obj.id)
                these_objs[val] = obj
        return these_objs

    def count(self, cls=None):
        """
        returns the count of all objects in storage
        """
        return (len(self.all(cls)))

    def delete(self, obj=None):
        """
        deletes obj from current database session if not None
        """
        if obj:
            self.__session.delete(obj)
            self.save()

    def delete_all(self):
        """
        deletes all stored objects, for testing purposes
        """
        for c_name, c_obj in DBStorage.CNC.items():
            if not self.verify_tables(c_name):
                continue
            a_query = self.__session.query(c_obj)
            all_objs = [obj for obj in a_query]
            for obj in range(len(all_objs)):
                to_delete = all_objs.pop(0)
                to_delete.delete()
        self.save()

    def reload(self):
        """
        creates all tables in database & session from engine
        """
        Base.metadata.create_all(self.__engine)
        self.__session = scoped_session(
            sessionmaker(
                bind=self.__engine,
                expire_on_commit=False))

    def close(self):
        """
        calls remove() on private session attribute (self.session)
        """
        self.__session.remove()
