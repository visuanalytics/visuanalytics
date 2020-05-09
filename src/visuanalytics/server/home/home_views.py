"""Handle requests for ´/<page>`.

Handle all Normal Html Page Requests.
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
    """If present, 'page.html' is returned from the templates folder.

    With the path `/`, `index.html` is returned.
    If `page.html` is not found a 404 page is returned

    Args:
        page(String): Html page name.
    Return:
        html_template: Html page from the templates folder with 'page.html' or a 404 page.
    """
    try:
        return render_template('%s.html' % page)
    except TemplateNotFound:
        abort(404)