import matplotlib.pyplot as plt
import numpy as np

from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.util import resources
from datetime import datetime, timedelta

dpi_default = 100
default_color = "#000000"
default_textprops = dict()
default_fontdict = {}


def generate_diagram(values: dict, step_data: StepData, prev_paths, infoprovider_name):
    # file = resources.new_temp_resource_path(step_data.data["_pipe_id"], "png")
    file = resources.get_image_path(infoprovider_name + "/" + values["diagram_config"]["name"] + ".png")
    with resources.open_resource(file, "wt") as f:
        pass

    plot_wrapper(values["diagram_config"], file, step_data)

    return file


def get_plot_vars(dpi=100):
    fig = plt.figure(dpi=dpi)
    ax = fig.add_subplot()
    return fig, ax


def line_plot(values, fig=None, ax=None, x=None):
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
    y = values.get("y", np.arange(len(values["x"])))
    height = values.get("height", 0.5)
    align = values.get("align", "center")
    color = values.get("color", default_color)
    edgecolor = values.get("edgecolor", default_color)
    linewidth = values.get("linewidth", 1)

    if not fig and not ax:
        fig, ax = get_plot_vars(dpi=values.get("dpi", dpi_default))
        ax.set_xticks(np.concatenate((np.array([0]), x)))
    ax.barh(y=y, width=values["x"], height=height, align=align, color=color, edgecolor=edgecolor, linewidth=linewidth)
    return fig, ax


def bar_multiple_plot(values, fig=None, ax=None):
    x = values.get("x", np.arange(len(values["y_left"])))
    width = values.get("width", 0.5)
    color_left = values.get("color_left", default_color)
    color_right = values.get("color_right", default_color)

    if not fig and not ax:
        fig, ax = get_plot_vars(dpi=values.get("dpi", dpi_default))
        ax.set_xticks(np.concatenate((np.array([0]), x)))
    ax.bar(x - width / 2, values["y_left"], width=width, color=color_left)
    ax.bar(x + width / 2, values["y_right"], width=width, color=color_right)
    return fig, ax


def barh_multiple_plot(values, fig=None, ax=None):
    y = values.get("y", np.arange(len(values["x_up"])))
    height = values.get("height", 0.5)
    color_up = values.get("color_up", default_color)
    color_down = values.get("color_down", default_color)

    if not fig and not ax:
        fig, ax = get_plot_vars(dpi=values.get("dpi", dpi_default))
        ax.set_xticks(np.concatenate((np.array([0]), x)))
    ax.barh(y=y - height / 2, width=values["x_up"], height=height, color=color_down)
    ax.barh(y=y + height / 2, width=values["x_down"], height=height, color=color_up)
    return fig, ax


def scatter_plot(values, fig=None, ax=None):
    x = values.get("x", np.arange(len(values["y"])))
    marker = values.get("marker", "o")
    area = values.get("area", None)
    color = values.get("color", default_color)

    if not fig and not ax:
        fig, ax = get_plot_vars(dpi=values.get("dpi", dpi_default))
        ax.set_xticks(np.concatenate((np.array([0]), x)))
    if area.any():
        ax.scatter(x, values["y"], marker=marker, s=area, c=color)
    else:
        ax.scatter(x, values["y"], marker=marker, c=color)
    return fig, ax


def filled_plot(values, fig=None, ax=None):
    x = values.get("x", np.arange(len(values["y"][0]["y"])))

    if not fig and not ax:
        fig, ax = get_plot_vars(dpi=values.get("dpi", dpi_default))
        ax.set_xticks(np.concatenate((np.array([0]), x)))
    for line in values["y"]:
        fig, ax = line_plot(values=line, fig=fig, ax=ax, x=x)
    for area in values["areas"]:
        sec = area.get("index_2", None)
        if sec:
            ax.fill_between(x, values["y"][area["index_1"]]["y"], values["y"][sec]["y"],
                            color=area.get("color", default_color), alpha=area.get("alpha", 1))
        else:
            ax.fill_between(x, values["y"][area["index_1"]]["y"], color=area.get("color", default_color),
                            alpha=area.get("alpha", 1))
    return fig, ax


def pie_plot(values, fig=None, ax=None):
    x = values["x"]
    explode = np.zeros(len(values["x"]))
    type_ = values.get("explode", None)
    if type_:
        type_ = type_["type"]
        explode_value = 0.1 if not values["shadow"] else 0.2
        if type_ == "min":
            explode[x.index(min(x))] = explode_value
        elif type_ == "max":
            explode[x.index(max(x))] = explode_value
        elif type_ == "list":
            for index in type_["indices"]:
                explode[index] = explode_value
    shadow = values.get("shadow", False)
    colors = values.get("colors", None)
    labels = values.get("labels", np.arange(len(x)))
    # textprobs = values.get("textprobs", default_textprobs)
    donut_style = values.get("donut_style", None)

    if not fig and not ax:
        fig, ax = get_plot_vars(dpi=values.get("dpi", dpi_default))
        ax.set_xticks(np.concatenate((np.array([0]), x)))
    if colors:
        ax.pie(x, explode=explode, autopct="%1.1f%%", shadow=shadow, colors=colors,
               labels=labels)  # , textprobs=textprobs)
    else:
        ax.pie(x, explode=explode, autopct="%1.1f%%", shadow=shadow, labels=labels)  # , textprobs=textprobs)
    if donut_style:
        circle = plt.Circle((0, 0), donut_style.get("area", 0.25), color=donut_style.get("color", "#ffffff"))
        p = plt.gcf()
        p.gca().add_artist(circle)
    return fig, ax


def create_plot(values, fig=None, ax=None):
    t = values["type"]
    if t == "custom":
        for plot in values["plots"]:
            fig, ax = create_plot(values=plot, fig=fig, ax=ax)
    elif t == "line":
        fig, ax = line_plot(values=values, fig=fig, ax=ax)
    elif t == "bar":
        fig, ax = bar_plot(values=values, fig=fig, ax=ax)
    elif t == "barh":
        fig, ax = barh_plot(values=values, fig=fig, ax=ax)
    elif t == "bar_multiple":
        fig, ax = bar_multiple_plot(values=values, fig=fig, ax=ax)
    elif t == "barh_multiple":
        fig, ax = barh_multiple_plot(values=values, fig=fig, ax=ax)
    elif t == "scatter":
        fig, ax = scatter_plot(values=values, fig=fig, ax=ax)
    elif t == "fill":
        fig, ax = filled_plot(values=values, fig=fig, ax=ax)
    elif t == "pie":
        fig, ax = pie_plot(values=values, fig=fig, ax=ax)

    return fig, ax


def plot_wrapper(values, file, step_data):
    values["y"] = step_data.format(values["y"])
    values["y"] = list(map(float, values["y"][1: -1].split(", ")))
    fig, ax = create_plot(values=values)
    title = values.get("title", None)
    x_label = values.get("x_label", None)
    y_label = values.get("y_label", None)
    x_ticks = values.get("x_ticks", None)

    if title:
        plt.title(title["text"], fontdict=title.get("fontdict", default_fontdict))
    if x_label:
        plt.xlabel(x_label["text"], fontdict=x_label.get("fontdict", default_fontdict))
    if y_label:
        plt.ylabel(y_label["text"], fontdict=y_label.get("fontdict", default_fontdict))
    if x_ticks:
        ax.set_xticklabels([None] + x_ticks["ticks"], fontdict=x_ticks.get("fontdict", default_fontdict),
                           color=x_ticks.get("color", default_color))
    plt.savefig(file)
    plt.close("all")

