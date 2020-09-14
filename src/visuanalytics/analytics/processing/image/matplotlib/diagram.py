import matplotlib.pyplot as plt

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.util import resources
from datetime import datetime, timedelta


def generate_diagram(values: dict, step_data: StepData, prev_paths):
    data = step_data.format(values["data"])
    data = data[1:len(data) - 1].split(",")
    data = list(map(float, data))
    days = []
    if step_data.format(values.get("label_use_date", False)) is True:
        now = datetime.now()
        for x in range(len(data)):
            day = now - timedelta(days=x)
            days.insert(0, day.strftime('%d.%m'))
    else:
        days = values["label"]
    plt.rcParams.update({'font.size': step_data.format(values.get("label_size", 18))})
    fig = plt.figure(
        figsize=[step_data.format(values.get("plot_size_x", 20)),
                 step_data.format(values.get("plot_size_y", 10))])
    ax = fig.add_subplot(111)
    for axis in ['top', 'bottom', 'left', 'right']:
        ax.spines[axis].set_linewidth(step_data.format(values.get("axis_depth", 1)))
    plt.bar(days, data, color=(step_data.format(values["label_colour"].get("r", 0)),
                               step_data.format(values["label_colour"].get("g", 0)),
                               step_data.format(values["label_colour"].get("b", 0)),
                               step_data.format(values["label_colour"].get("t", 1))))
    plt.xticks(rotation=step_data.format(values.get("label_rotation", 0)))
    plt.tight_layout()
    file = resources.new_temp_resource_path(step_data.data["_pipe_id"], "png")
    plt.savefig(file, transparent=True)
    return file