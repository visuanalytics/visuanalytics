"""unittest Module für den Server Endpunkt `/api/v1/test/`.

Ist nur zu Testen gedacht, wird später entfernt..
"""
import unittest

from flask import json

from visuanalytics.tests.server import test_init


class TestApiTest(unittest.TestCase):
    def setUp(self):
        """Flask Server Client initialisieren."""
        self.client = test_init.setup_client()

    def test_id(self):
        """Testen Endpunkt `../test/<id>`.

        Testet ob Server mit `{"test": "<id>"}` antwortet.
        """
        rv = self.client.get("/api/v1/test/1")
        data = json.loads(rv.data)
        self.assertEqual({"test": "1"}, data)