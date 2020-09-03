import matplotlib.pyplot as plt
from visuanalytics.util import resources
from datetime import datetime, timedelta

def diagramm(len: int):
    now = datetime.now()

    cases = [300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 310]
    days = []

    for x in range(len):
        day = now - timedelta(days=x)
        days.insert(0, day.strftime('%d. %b'))

    plt.rcParams.update({'font.size': 22})
    fig = plt.figure(figsize=[10, 6])
    ax = fig.add_subplot(111)
    for axis in  ['top','bottom','left','right']:
        ax.spines[axis].set_linewidth(2)
    plt.bar(days, cases, color =(0.02, 0.36, 0.49, 1))
    plt.xticks(rotation=45)
    plt.savefig(resources.new_temp_resource_path('test', "png"), transparent=True)
