import matplotlib.pyplot as plt
from visuanalytics.util import resources



def diagramm():
    cases = [300, 302, 302, 310, 313, 320, 321, 330, 300, 302, 302, 310, 313, 320]
    days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

    plt.rcParams.update({'font.size': 22})
    fig = plt.figure(figsize=[10, 5])
    ax = fig.add_subplot(111)
    for axis in  ['top','bottom','left','right']:
        ax.spines[axis].set_linewidth(2)
    plt.bar(days, cases, color =(0.02, 0.36, 0.49, 1))
    plt.savefig(resources.new_temp_resource_path('test', "png"), transparent=True)
