import json
from pip._vendor import requests

def get_api_data(url):
    response = requests.get(url)
    if(response.status_code != 200):
        raise ValueError
    return json.load(response.content)