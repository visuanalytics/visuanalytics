"""unittest Module für Statiche HTML Seiten."""

import unittest

from visuanalytics.tests.server import test_init

class TestHome(unittest.TestCase):
    def setUp(self):
        """Flask Server Client initialisieren."""
        self.client = test_init.setup_client()

    def test_index(self):
        """Testet ob `/` existiert."""
        rv = self.client.get("/")
        self.assertEqual(rv.status_code, 200)

    def test_corona(self):
        """Testet ob `/corona` existiert"""
        rv = self.client.get("/corona")
        self.assertEqual(rv.status_code, 200)

    def test_historische_ereignisse(self):
        """Testet ob `/historische_ereignisse` existiert"""
        rv = self.client.get("/historische_ereignisse")
        self.assertEqual(rv.status_code, 200)

    def test_iss_daten(self):
        """Testet ob `/issdaten` existiert"""
        rv = self.client.get("/issdaten")
        self.assertEqual(rv.status_code, 200)

    def test_wetter(self):
        """Testet ob `/wetter` existiert"""
        rv = self.client.get("/wetter")
        self.assertEqual(rv.status_code, 200)
