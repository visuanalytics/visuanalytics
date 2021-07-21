import matplotlib
import matplotlib.pyplot as plt
import numpy as np
import json
import operator
from functools import reduce

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.util import resources
from datetime import datetime, timedelta
from ast import literal_eval
from visuanalytics.util.resources import get_test_diagram_resource_path

matplotlib.use('Agg')

dpi_default = 100
default_color = "#000000"
default_textprops = dict()
default_fontdict = {}


def generate_diagram(values: dict, step_data: StepData, prev_paths):
    """
    Alte Implementierung der Diagramme für alte Job-Konfigurationen
    """
    data = step_data.format(values["data"])
    data = data[1:len(data) - 1].split(", ")
    data = list(map(float, data))
    days = []
    labels = None
    if values.get("bar_label", None) is not None:
        labels = step_data.format(values["bar_label"])
        labels = labels[1:len(labels) - 1].split(", ")
        labels = list(map(str, labels))
    if step_data.format(values.get("label_use_date", False)):
        now = datetime.now()
        for hop_value in range(len(data)):
            day = now - timedelta(days=hop_value)
            days.insert(0, day.strftime('%d.%m'))
    else:
        days = step_data.format(values["label"])
        days = days.replace("'", "")
        days = days[1:len(days) - 1].split(", ")
        days = list(map(str, days))
        if values.get("label_append", None) is not None:
            replace_cities = values["label_append"]
            for idx, city in enumerate(days):
                for replace_city in replace_cities:
                    if city == replace_city:
                        label_append_value = str(values["label_append_value"])
                        label_append_value = label_append_value.replace("_idx", str(idx))
                        days[idx] = city + " " + step_data.format(label_append_value)
    plt.rcParams.update({'font.size': step_data.format(values.get("label_size", 18))})
    fig = plt.figure(
        figsize=[step_data.format(values.get("plot_size_x", 20)),
                 step_data.format(values.get("plot_size_y", 10))])
    ax = fig.add_subplot(111)

    if step_data.format(values.get("sorted", False)):
        if labels is None:
            days, data = zip(*sorted(zip(days, data)))
        else:
            days, data, labels = zip(*sorted(zip(days, data, labels)))

    for axis in ['top', 'bottom', 'left', 'right']:
        ax.spines[axis].set_linewidth(step_data.format(values.get("axis_depth", 1)))

    if values.get("grid_axis", None) is not None:
        ax.grid(axis=step_data.format(values["grid_axis"]), color=step_data.format(values.get("grid_color", "grey")))
    if step_data.format(values["plot_type"]) == "bar_chart":
        ax.set_yticks(np.arange(len(days)))
        ax.set_yticklabels(days)
        if step_data.get_config("marked_city", None) is not None:
            for l in ax.get_yticklabels():
                if l.get_text() == step_data.format(step_data.get_config("marked_city", "")):
                    l.set_fontweight(550)
        ax.invert_yaxis()  # labels von oben nach unten

        bar_list = plt.barh(np.arange(len(days)), data,
                            color=(step_data.format(values["label_color"].get("r", 0)),
                                   step_data.format(values["label_color"].get("g", 0)),
                                   step_data.format(values["label_color"].get("b", 0)),
                                   step_data.format(values["label_color"].get("t", 1))))

    elif step_data.format(values["plot_type"]) == "column_chart":
        bar_list = plt.bar(days, data,
                           color=(step_data.format(values["label_color"].get("r", 0)),
                                  step_data.format(values["label_color"].get("g", 0)),
                                  step_data.format(values["label_color"].get("b", 0)),
                                  step_data.format(values["label_color"].get("t", 1))))
    else:
        raise
    if step_data.format(values.get("use_extended_labels", False)):
        current_value = 0
        x_label_list = [current_value]
        max_value = max(data)
        hop_value = 10
        hop_values = values.get("extended_labels_map", None)
        if hop_values is not None:
            for entry in hop_values:
                if entry["value"] < max_value:
                    hop_value = entry["step"]
        while current_value < max_value:
            current_value = current_value + hop_value
            x_label_list.append(current_value)
        counter = 0
        counters = values.get("extended_labels_append", None)
        if counters is not None:
            for entry in counters:
                if entry["value"] < max_value:
                    counter = entry["amount"]
        while counter != 0:
            current_value = current_value + hop_value
            x_label_list.append(current_value)
            counter = counter - 1
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

    if values.get("bar_label", None) is not None:
        rects = ax.patches
        for rect, label, data, days in zip(rects, labels, data, days):
            if step_data.format(values.get("show_bar_label_sign", False)):
                if label[0] != '-' and float(label) != 0.0:
                    label = "+" + label
                if float(label) == 0.0:
                    label = "\u00B10"
            label = str(data) + " / " + label
            if step_data.get_config("marked_city", None) is not None:
                if days == step_data.format(step_data.get_config("marked_city", "")):
                    ax.text(rect.get_width() + 0.4, (rect.get_y() + rect.get_height() / 2) + 0.2, label,
                            fontsize=step_data.format(values["label_fontsize"]), fontweight=550)
                else:
                    ax.text(rect.get_width() + 0.4, (rect.get_y() + rect.get_height() / 2) + 0.2, label,
                            fontsize=step_data.format(values["label_fontsize"]))
    file = resources.new_temp_resource_path(step_data.data["_pipe_id"], "png")
    plt.savefig(file, transparent=True)
    return file


def generate_diagram_custom(values: dict, step_data: StepData):  # , prev_paths):
    """
    Erstellt ein Diagramm

    :param values: Konfigurations-Dict für ein Diagramm
    :param step_data: Daten der Pipeline

    :return: Pfad zu dem erstellten Diagramm
    """
    file = resources.get_image_path(f"diagrams/{values['diagram_config']['infoprovider']}_{values['diagram_config']['name']}.png")
    with resources.open_resource(file, "wt") as f:
        pass

    plot_wrapper(values["diagram_config"], file, step_data)

    return file


def generate_test_diagram(values, infoprovider_name=None, diagram_name=None):
    """
    Erstellt ein Testdiagramm mit zufälligen Werten, um eine Diagrammvorschau im Frontend anzuzeigen.

    :param values: Konfiguration des Diagramms
    :param inforprovider_name: Name des Infoproviders
    :param diagram_name: Name des Diagramms

    :return: Pfad zu dem erstellten Diagramm
    """
    fig, ax = (None, None)
    for plot in values["diagram_config"]["plots"]:
        plot["plot"]["y"] = np.random.randint(1, 20, len(plot["plot"]["x"]))
        plot["plot"].pop("x", None)
        fig, ax, _ = create_plot(plot, None, None, get_xy=False, fig=fig, ax=ax)

    file = get_test_diagram_resource_path(infoprovider_name=infoprovider_name, diagram_name=diagram_name)
    title = values.get("title", None)
    x_label = values.get("x_label", None)
    y_label = values.get("y_label", None)
    grid = values.get("grid", None)
    face_color = values.get("face_color", None)

    if title:
        plt.title(title["text"], fontdict=title.get("fontdict", default_fontdict))
    if x_label:
        plt.xlabel(x_label["text"], fontdict=x_label.get("fontdict", default_fontdict))
    if y_label:
        plt.ylabel(y_label["text"], fontdict=y_label.get("fontdict", default_fontdict))
    if grid:
        ax.grid(color=grid.get("color", "gray"), linestyle=grid.get("linestyle", "-"),
                linewidth=grid.get("linewidth", 1), axis=grid.get("axis", "both"))
    if face_color:
        ax.set_facecolor(face_color)

    plt.savefig(file)
    plt.close("all")

    return file


def get_plot_vars(dpi=100):
    """
    Erstellt ein matplotlib.figure.Figure und matplotlib.axes.Axes für einen Plot.

    :param dpi: Auflösung des Diagramms

    :return: figure- und ax-Objekt für einen Plot
    """
    fig = plt.figure(dpi=dpi)
    ax = fig.add_subplot()
    return fig, ax


def line_plot(values, fig=None, ax=None, x=None):
    """
    Legt ein Liniendiagramm auf einen Plot.

    :param values: Konfiguration des Diagramms
    :param fig: figure-Objekt des Plots
    :param ax: ax-Objekt des Plots
    :param x: vordefinierte X-Werte des Diagramms

    :return: bearbeitetes figure- und ax-Objekt für einen Plot
    """
    if not x:
        x = values.get("x", np.arange(len(values["y"])) + 1)
    style = values.get("style", "-")
    color = values.get("color", default_color)

    if not fig and not ax:
        fig, ax = get_plot_vars(dpi=values.get("dpi", dpi_default))
    ax.set_xticks(np.concatenate((np.array([0]), x)))
    ax.plot(x, values["y"], style, color=color)
    return fig, ax


def bar_plot(values, fig=None, ax=None):
    """
    Legt ein Säulendiagramm auf einen Plot.

    :param values: Konfiguration des Diagramms
    :param fig: figure-Objekt des Plots
    :param ax: ax-Objekt des Plots

    :return: bearbeitetes figure- und ax-Objekt für einen Plot
    """
    x = values.get("x", np.arange(len(values["y"])))
    width = values.get("width", 0.5)
    align = values.get("align", "center")
    color = values.get("color", default_color)
    edgecolor = values.get("edgecolor", default_color)
    linewidth = values.get("linewidth", 1)

    if not fig and not ax:
        fig, ax = get_plot_vars(dpi=values.get("dpi", dpi_default))
    ax.set_xticks(np.concatenate((np.array([0]), x)))
    ax.bar(x, values["y"], width=width, align=align, color=color, edgecolor=edgecolor, linewidth=linewidth)
    return fig, ax


def barh_plot(values, fig=None, ax=None):
    """
    Legt ein Balkendiagramm auf einen Plot.

    :param values: Konfiguration des Diagramms
    :param fig: figure-Objekt des Plots
    :param ax: ax-Objekt des Plots

    :return: bearbeitetes figure- und ax-Objekt für einen Plot
    """
    y = values.get("x", np.arange(len(values["y"])))
    height = values.get("height", 0.5)
    align = values.get("align", "center")
    color = values.get("color", default_color)
    edgecolor = values.get("edgecolor", default_color)
    linewidth = values.get("linewidth", 1)

    if not fig and not ax:
        fig, ax = get_plot_vars(dpi=values.get("dpi", dpi_default))
    ax.set_yticks(np.concatenate((np.array([0]), y)))
    ax.barh(y=y, width=values["y"], height=height, align=align, color=color, edgecolor=edgecolor, linewidth=linewidth)
    return fig, ax


def scatter_plot(values, fig=None, ax=None):
    """
    Legt ein Streudiagramm auf einen Plot.

    :param values: Konfiguration des Diagramms
    :param fig: figure-Objekt des Plots
    :param ax: ax-Objekt des Plots

    :return: bearbeitetes figure- und ax-Objekt für einen Plot
    """
    x = values.get("x", np.arange(len(values["y"])))
    marker = values.get("marker", "o")
    area = values.get("area", None)
    color = values.get("color", default_color)

    if not fig and not ax:
        fig, ax = get_plot_vars(dpi=values.get("dpi", dpi_default))
    ax.set_xticks(np.concatenate((np.array([0]), x)))
    if area and area.any():
        ax.scatter(x, values["y"], marker=marker, s=area, c=color)
    else:
        ax.scatter(x, values["y"], marker=marker, c=color)
    return fig, ax


def pie_plot(values, fig=None, ax=None):
    """
    Legt ein Kuchendiagramm auf einen Plot.

    :param values: Konfiguration des Diagramms
    :param fig: figure-Objekt des Plots
    :param ax: ax-Objekt des Plots

    :return: bearbeitetes figure- und ax-Objekt für einen Plot
    """
    y = values["y"]
    explode = np.zeros(len(values["y"]))
    type_ = values.get("explode", None)
    if type_:
        type_ = type_["type"]
        explode_value = 0.1 if not values["shadow"] else 0.2
        if type_ == "min":
            explode[y.index(min(y))] = explode_value
        elif type_ == "max":
            explode[y.index(max(y))] = explode_value
        elif type_ == "list":
            for index in type_["indices"]:
                explode[index] = explode_value
    shadow = values.get("shadow", False)
    colors = values.get("colors", None)
    x_ticks = values.get("x_ticks", None)
    if x_ticks:
        labels = x_ticks.get("ticks", np.arange(len(y)))
    else:
        labels = np.arange(len(y))
    # textprobs = values.get("textprobs", default_textprobs)
    donut_style = values.get("donut_style", None)

    if not fig and not ax:
        fig, ax = get_plot_vars(dpi=values.get("dpi", dpi_default))
        #ax.set_xticks(np.concatenate((np.array([0]), y)))
    if colors:
        ax.pie(y, explode=explode, autopct="%1.1f%%", shadow=shadow, colors=colors,
               labels=labels)  # , textprobs=textprobs)
    else:
        ax.pie(y, explode=explode, autopct="%1.1f%%", shadow=shadow, labels=labels)  # , textprobs=textprobs)
    if donut_style:
        circle = plt.Circle((0, 0), donut_style.get("area", 0.25), color=donut_style.get("color", "#ffffff"))
        p = plt.gcf()
        p.gca().add_artist(circle)
    return fig, ax


def get_x_y(values, step_data, array_source, custom_labels=False, primitive=True):
    """
    Generiert die Y-Werte für das Diagramm aus den Daten der Datenquellen. Dabei werden u.U. nur bestimmte Indices eines Arrays
    verwendet, je nachdem, wie der Nutzer das festlegt.

    :param values: Konfiguration des Diagramms
    :param step_data: Daten der Pipeline
    :param array_source: Boolean, der aussagt, ob es sich um ein Array der API-Daten handelt, oder um historisierte Daten
    :param custom_labels: Boolean, der aussagt, ob der Benutzer eigene Labels angegeben hat
    :param primitive: Boolean, der aussagt, ob das Daten-Array primitiv ist, oder nicht

    :return: aufbereitete Konbfiguration mit den tatsächlichen Y-Werten
    """
    if array_source:
        if primitive:
            y_vals = step_data.format(values["y"])
            y_vals = y_vals.replace("[", "").replace("]", "").split(", ")
            y_vals = list(map(float, y_vals))
            y_vals = list(map(y_vals.__getitem__, values.get("x", np.arange(len(y_vals)))))
        else:
            array = step_data.format(values["y"])
            array = literal_eval(array)
            array = list(map(array.__getitem__, values.get("x", np.arange(len(array)))))
            y_vals = [reduce(operator.getitem, values["numericAttribute"].split('|'), x) for x in array]
            #print("y_vals", y_vals)
            if not custom_labels:
                x_ticks = values.get("x_ticks", {})
                x_ticks.update({"ticks": [reduce(operator.getitem, values["stringAttribute"].split('|'), x) for x in array]})
                values.update({"x_ticks": x_ticks})
    else:
        y_vals = step_data.format(values["y"])
        y_vals = y_vals.replace("[", "").replace("]", "").split(", ")
        y_vals = list(map(float, y_vals))
        y_vals = list(map(y_vals.__getitem__, [i - 1 for i in values.get("x", np.arange(len(y_vals)))]))

    values["y"] = y_vals
    values.pop("x", None)

    return values


def create_plot(values, step_data, array_source, get_xy=True, fig=None, ax=None):
    """
    Erstellt ein Diagramm je nach Typ der Konfiguration und setzt auch die Label der X-Achse (Y bei Balken)

    :param values: Konfiguration des Diagramms
    :param step_data: Daten der Pipeline
    :param array_source: Boolean, der aussagt, ob es sich um ein Array der API-Daten handelt, oder um historisierte Daten
    :param get_xy: Boolean, der aussagt, ob Y-Werte aus den Pipeline-Daten geholt werden müssen (False bei Testdiagrammen)
    :param fig: figure-Objekt des Plots
    :param ax: ax-Objekt des Plots

    :return: bearbeitetes figure- und ax-Objekt für einen Plot
    """
    t = values["plot"]["type"]
    if get_xy:
        values_new = get_x_y(values["plot"], step_data, array_source, custom_labels=values.get("customLabels", False), primitive=values.get("primitive", True))
    else:
        values_new = values["plot"]
    if t == "line":
        fig, ax = line_plot(values=values_new, fig=fig, ax=ax)
    elif t == "bar":
        fig, ax = bar_plot(values=values_new, fig=fig, ax=ax)
    elif t == "barh":
        fig, ax = barh_plot(values=values_new, fig=fig, ax=ax)
    elif t == "scatter":
        fig, ax = scatter_plot(values=values_new, fig=fig, ax=ax)
    elif t == "pie":
        fig, ax = pie_plot(values=values_new, fig=fig, ax=ax)

    x_ticks = values_new.get("x_ticks", None)
    if x_ticks and len(x_ticks['ticks']) > 1 and t != 'pie':
        if t != 'barh':
            ax.set_xticklabels([None] + x_ticks["ticks"], fontdict=x_ticks.get("fontdict", default_fontdict), color=x_ticks.get("color", default_color))
        else:
            ax.set_yticklabels([None] + x_ticks["ticks"], fontdict=x_ticks.get("fontdict", default_fontdict), color=x_ticks.get("color", default_color))

    return fig, ax, values_new['y']


def create_plot_custom(values, step_data, fig=None, ax=None):
    """
    Erstellt mehrere Diagramme für einen Plot

    :param values: Konfiguration des Diagramms
    :param step_data: Daten der Pipeline
    :param fig: figure-Objekt des Plots
    :param ax: ax-Objekt des Plots

    :return: bearbeitetes figure- und ax-Objekt für einen Plot
    """
    array_source = values["sourceType"] == "Array"
    min_y = None
    max_y = None
    for plot in values["plots"]:
        fig, ax, y = create_plot(plot, step_data, array_source=array_source, fig=fig, ax=ax)
        if min_y:
            if min(y) < min_y:
                min_y = min(y)
        else:
            min_y = min(y)
        if max_y:
            if max(y) < max_y:
                max_y = max(y)
        else:
            max_y = max(y)
    diff = max_y - min_y
    plt.ylim((min_y - 0.10 * diff, max_y + 0.10 * diff))
    return fig, ax


def plot_wrapper(values, file, step_data):
    """
    Stößt die Erstellung eines Plots an und führt style-Optionen des Koordinatensystems aus.

    :param values: Konfiguration des Diagramms
    :param file: Pfad, unter dem das Diagramm abgespeichert werden soll
    :param step_data: Daten der Pipeline
    """
    fig, ax = create_plot_custom(values, step_data)
    title = values.get("title", None)
    x_label = values.get("x_label", None)
    y_label = values.get("y_label", None)
    # x_ticks = values.get("x_ticks", None)
    grid = values.get("grid", None)
    face_color = values.get("face_color", None)

    if title:
        plt.title(title["text"], fontdict=title.get("fontdict", default_fontdict))
    if x_label:
        plt.xlabel(x_label["text"], fontdict=x_label.get("fontdict", default_fontdict))
    if y_label:
        plt.ylabel(y_label["text"], fontdict=y_label.get("fontdict", default_fontdict))
    if grid:
        ax.grid(color=grid.get("color", "gray"), linestyle=grid.get("linestyle", "-"), linewidth=grid.get("linewidth", 1), axis=grid.get("axis", "both"))
    if face_color:
        ax.set_facecolor(face_color)

    plt.savefig(file)
    plt.close("all")
