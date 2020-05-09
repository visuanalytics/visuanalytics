"""unittest Module for the server endpoint `/api/v1/test/`.

May be Removed later.
"""
import unittest

from flask import json

from visuanalytics.tests.server import test_init


class TestApiTest(unittest.TestCase):
    def setUp(self):
        """Setup Flask Server Client"""
        self.client = test_init.setup_client()

    def test_id(self):
        """Test endpoint ../test/<id>.

        Test if response is {"test": "<id>"}.
        """
        rv = self.client.get("/api/v1/test/1")
        data = json.loads(rv.data)
        self.assertEqual({"test": "1"}, data)