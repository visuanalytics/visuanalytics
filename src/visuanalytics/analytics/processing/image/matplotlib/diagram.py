import matplotlib.pyplot as plt
import numpy as np

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.util import resources
from datetime import datetime, timedelta


def generate_diagram(values: dict, step_data: StepData, prev_paths):
    data = step_data.format(values["data"])
    data = data[1:len(data) - 1].split(", ")
    data = list(map(float, data))
    days = []
    if step_data.format(values.get("label_use_date", False)) is True:
        now = datetime.now()
        for hop_value in range(len(data)):
            day = now - timedelta(days=hop_value)
            days.insert(0, day.strftime('%d.%m'))
    else:
        days = step_data.format(values["label"])
        days = days[1:len(days) - 1].split(", ")
        days = list(map(str, days))
    plt.rcParams.update({'font.size': step_data.format(values.get("label_size", 18))})
    fig = plt.figure(
        figsize=[step_data.format(values.get("plot_size_x", 20)),
                 step_data.format(values.get("plot_size_y", 10))])

    ax = fig.add_subplot(111)

    for axis in ['top', 'bottom', 'left', 'right']:
        ax.spines[axis].set_linewidth(step_data.format(values.get("axis_depth", 1)))

    if step_data.format(values["plot_type"]) == "bar_chart":
        ax.set_yticks(np.arange(len(days)))
        ax.set_yticklabels(days)
        ax.invert_yaxis()  # labels von oben nach unten

        bar_list = plt.barh(np.arange(len(days)), data,
                            color=(step_data.format(values["label_colour"].get("r", 0)),
                                   step_data.format(values["label_colour"].get("g", 0)),
                                   step_data.format(values["label_colour"].get("b", 0)),
                                   step_data.format(values["label_colour"].get("t", 1))))

    elif step_data.format(values["plot_type"]) == "column_chart":
        bar_list = plt.bar(days, data,
                           color=(step_data.format(values["label_colour"].get("r", 0)),
                                  step_data.format(values["label_colour"].get("g", 0)),
                                  step_data.format(values["label_colour"].get("b", 0)),
                                  step_data.format(values["label_colour"].get("t", 1))))
    else:
        raise

    if step_data.format(values.get("use_special_x_labels", False)) is True:
        current_value = step_data.format(values.get("x_label_start", 0))
        x_label_list = [current_value]
        max_value = max(data)
        if values.get("x_label_max_value", None) is not None:
            max_value = step_data.format(values["x_label_max_value"])
        hop_value = step_data.format(values.get("x_label_hop", 10))
        while current_value < max_value:
            current_value = current_value + hop_value
            x_label_list.append(current_value)
        if step_data.format(values.get("x_label_one_value_more", False)) is True:
            x_label_list.append(current_value + hop_value)
        ax.set_xticks(x_label_list)

    for idx, b in enumerate(bar_list):
        color_not_set = True
        for entry in values["bar_colors"]["list"]:
            if data[idx] > step_data.format(entry["number"]):
                b.set_color(step_data.format(entry["color"]))
                color_not_set = False
            if color_not_set:
                b.set_color(step_data.format(values["bar_colors"]["default"]))

    plt.xticks(rotation=step_data.format(values.get("label_rotation", 0)))
    plt.tight_layout()

    if values.get("label_data", None) is not None:
        rects = ax.patches
        labels = step_data.format(values["label_data"])
        labels = labels[1:len(labels) - 1].split(", ")
        labels = list(map(str, labels))
        for rect, label in zip(rects, labels):
            if step_data.format(values.get("use+-_label", False)) is True:
                if label[0] != '-' and float(label) != 0.0:
                    label = "+" + label
                if float(label) == 0.0:
                    label = "0"
            ax.text(rect.get_width() + 0.4, (rect.get_y() + rect.get_height() / 2) + 0.2, label,
                    fontsize=step_data.format(values["label_fontsize"]))

    file = resources.new_temp_resource_path(step_data.data["_pipe_id"], "png")
    plt.savefig(file, transparent=True)
    return file
