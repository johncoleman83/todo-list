#!/usr/bin/python3
"""
Unit Test for DB Storage model
"""
import unittest
from datetime import datetime
import inspect
from models import db_storage, storage, User, Task, \
    APP_PORT, APP_HOST, REQUIRED, CNC
from models.base_model import Base
from os import environ, stat
import pycodestyle
DBStorage = db_storage.DBStorage


class TestDBStorageDocs(unittest.TestCase):
    """
    Class for testing DBStorage class docs
    """

    all_funcs = inspect.getmembers(DBStorage, inspect.isfunction)

    @classmethod
    def setUpClass(cls):
        """
        sets up class
        """
        print('..... Test {} .....'.format(cls.__name__))

    def tearDownClass():
        """
        tidies up the tests
        """
        pass

    def test_doc_file(self):
        """
        ... documentation for the file
        """
        self.assertIsNotNone(db_storage.__doc__)

    def test_doc_class(self):
        """
        ... documentation for the class
        """
        self.assertIsNotNone(DBStorage.__doc__)

    def test_all_function_docs(self):
        """
        ... tests for ALL DOCS for all functions in db_storage file
        """
        all_functions = TestDBStorageDocs.all_funcs
        for function in all_functions:
            self.assertIsNotNone(function[1].__doc__)

    def test_pycode_style_db(self):
        """
        ... db_storage.py conforms to pycodestyle Style
        """
        pycodestyle_test = pycodestyle.StyleGuide(quiet=True)
        errors = pycodestyle_test.check_files(['models/engine/db_storage.py'])
        self.assertEqual(errors.total_errors, 0, errors.messages)

    def test_file_is_executable(self):
        """
        ... tests if file has correct permissions so user can execute
        """
        file_stat = stat('models/engine/db_storage.py')
        permissions = str(oct(file_stat[0]))
        actual = int(permissions[5:-2]) >= 5
        self.assertTrue(actual)


class TestTracebackNullError(unittest.TestCase):
    """
    testing for throwing Traceback erros:
    missing attributes that Cannot be NULL
    """

    @classmethod
    def setUpClass(cls):
        """
        sets up the class for this round of tests
        """
        print('..... Test {} .....'.format(cls.__name__))

    def tearDownClass():
        """
        tidies up the tests removing storage objects
        """
        storage.delete_all()

    def tearDown(self):
        """
        tidies up tests that throw errors
        """
        storage.rollback_session()

    def test_state_no_name(self):
        """
        ... checks to create a user with no attributes
        """
        with self.assertRaises(Exception) as context:
            u = User()
            u.save()
        self.assertIsNotNone(str(context.exception))


if __name__ == '__main__':
    """
    main tests
    """
    unittest.main
