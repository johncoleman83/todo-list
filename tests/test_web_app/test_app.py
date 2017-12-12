#!/usr/bin/python3
"""
Unit Test for DB Storage model
"""
import unittest
import inspect
from os import environ, stat
from web_app import app as flask_app_module
from web_app.app import app as flask_app
import pycodestyle


class TestFlaskAppDocs(unittest.TestCase):
    """
    Class for testing FlaskApp class docs
    """

    all_funcs = inspect.getmembers(flask_app_module, inspect.isfunction)

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
        documentation for the file
        """
        self.assertIsNotNone(flask_app_module.__doc__)

    def test_all_function_docs(self):
        """
        tests for ALL DOCS for all functions
        """
        all_functions = TestFlaskAppDocs.all_funcs
        for function in all_functions:
            self.assertIsNotNone(function[1].__doc__)

    def test_pycode_style_db(self):
        """
        conforms to pycodestyle Style
        """
        pycodestyle_test = pycodestyle.StyleGuide(quiet=True)
        errors = pycodestyle_test.check_files(['web_app/app.py'])
        self.assertEqual(errors.total_errors, 0, errors.messages)

    def test_file_is_executable(self):
        """
        tests if file has correct permissions so user can execute
        """
        file_stat = stat('web_app/app.py')
        permissions = str(oct(file_stat[0]))
        actual = int(permissions[5:-2]) >= 5
        self.assertTrue(actual)


class TestGetRequestIndex(unittest.TestCase):
    """
    test get request to '/'
    """

    app = flask_app.test_client()

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
        pass

    def setUp(self):
        """
        initializer for each test
        """
        self.app = TestGetRequestIndex.app

    def tearDown(self):
        """
        tidies up tests that throw errors
        """
        pass

    def test_get_request_index(self):
        """
        checks to create a user with no attributes
        """
        r = self.app.get('/')
        self.assertEqual(str(r.status), '200 OK')


if __name__ == '__main__':
    """
    main tests
    """
    unittest.main
