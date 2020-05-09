"""unittest Module for Static HTML Pages."""

import unittest

from visuanalytics.tests.server import test_init

class TestHome(unittest.TestCase):
    def setUp(self):
        """Setup Flask Server Client"""
        self.client = test_init.setup_client()

    def test_index(self):
        """Test if `/` exists"""
        rv = self.client.get("/")
        self.assertEqual(rv.status_code, 200)

    def test_corona(self):
        """Test if `/corona` exists"""
        rv = self.client.get("/corona")
        self.assertEqual(rv.status_code, 200)

    def test_historische_ereignisse(self):
        """Test if `/historische_ereignisse` exists"""
        rv = self.client.get("/historische_ereignisse")
        self.assertEqual(rv.status_code, 200)

    def test_iss_daten(self):
        """Test if `/issdaten` exists0"""
        rv = self.client.get("/issdaten")
        self.assertEqual(rv.status_code, 200)

    def test_wetter(self):
        """Test if `/wetter` exists"""
        rv = self.client.get("/wetter")
        self.assertEqual(rv.status_code, 200)
