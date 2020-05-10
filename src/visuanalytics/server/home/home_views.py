"""Nimmt alle Requests zum Endpunt ´/<page>` entgegen.

Behandelt alle normalen HTML Seiten Anfragen.
"""
from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound

home_bp = Blueprint('home', __name__,
                    # register home/static as static directory
                    static_folder="static", static_url_path="/static/home"
                    # register hone/templates as template src
                    , template_folder="templates")


@home_bp.route('/', defaults={'page': 'index'})
@home_bp.route('/<page>')
def show(page):
    """Falls vorhanden, wird 'page.html' aus dem 'templates' Ordner zurückgegeben.

    Mit dem Pfad `/` wird `index.html` zurückgegeben.
    Wenn `page.html` nicht gefunden wird, wird eine 404-Seite zurückgegeben.

    Args:
        page(String): Name der Html-Seite.
    Return:
        html_template: Html-Seite aus dem 'templates' Ordner mit 'page.html' oder einer 404-Seite.
    """
    try:
        return render_template('%s.html' % page)
    except TemplateNotFound:
        abort(404)