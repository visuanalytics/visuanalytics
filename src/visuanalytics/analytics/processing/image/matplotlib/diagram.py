import matplotlib.pyplot as plt

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.util import resources
from datetime import datetime, timedelta


def generate_diagram(values: dict, step_data: StepData, prev_paths):
    data = step_data.format(values["data"])
    data = data[1:len(data) - 1].split(",")
    data = list(map(float, data))
    now = datetime.now()
    days = []

    for x in range(len(data)):
        day = now - timedelta(days=x)
        days.insert(0, day.strftime('%d.%m'))
    plt.rcParams.update({'font.size': 18})
    fig = plt.figure(figsize=[9, 4.5])
    ax = fig.add_subplot(111)
    for axis in ['top', 'bottom', 'left', 'right']:
        ax.spines[axis].set_linewidth(2)
    plt.bar(days, data, color=(0.02, 0.36, 0.49, 1))
    plt.xticks(rotation=45)
    plt.tight_layout()
    file = resources.new_temp_resource_path(step_data.data["_pipe_id"], "png")
    plt.savefig(file, transparent=True)
    return file
