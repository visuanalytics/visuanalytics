from numpy import random

def get_summaries(data):
    data_summaries = []
    today = data['summaries'][0]
    tomorrow = data['summaries'][1]
    next_1 = data['summaries'][2]
    next_2 = data['summaries'][3]
    next_3 = data['summaries'][4]
    data_summaries.update(today)
    data_summaries.update(tomorrow)
    data_summaries.update(next_1)
    data_summaries.update(next_2)
    data_summaries.update(next_3)
    return data_summaries

CITIES = ['München','Berlin', 'Gießen', 'Garmisch-Partenkirchen', 'Hamburg', 'Bremen', 'Frankfurt',
          'Dresden', 'Düsseldorf', 'Saarbrücken', 'Kiel', 'Hannover', 'Nürnberg', 'Schwerin', 'Stuttgart']

def get_data_today_tomorrow(data):
    x = random.choice(CITIES)
    CITIES.remove(x)
    y = random.choice(CITIES)
    CITIES.append(x)
    return today_tomorrow

def add_data_together(data):
    data_for_text = []
    data_summaries = get_summaries(data)
    today_tomorrow = get_data_today_tomorrow(data)
    data_for_text.update(data_summaries)
    data_for_text.update(today_tomorrow)
    return data_for_text