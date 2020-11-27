import matplotlib.pyplot as plt
import numpy as np
from matplotlib.collections import PatchCollection
from matplotlib.colors import LinearSegmentedColormap
from matplotlib.patches import Polygon
from mpl_toolkits.basemap import Basemap

#########################################################################################
# read population data and saves the data in the dictionary population
data = open("API_SP.POP.TOTL_DS2_en_csv_v2_988606.csv").readlines()
population = {}
for line in data[5:]:  # die relevanten Daten starten ab der 6. Zelle
    line = line.replace('",', ',').replace('"', '').split(
        ',')  # es stand alles zu einem Land in einer Zelle, also nach jedem Kommata trennen und in einzelne "Zellen" in der Liste schreiben
    value = line[-3]  # in der drittletzten "Spalte" stehen die relevanten Werte zur Bevölkerung im Jahr 2018
    key = line[1]  # Country Code steht in der 2. "Spalte
    population[key] = value  # Bevölkerung in 2018
    population.update({'key': 'value'})

#########################################################################################
# draw empty worldmap without country shapes
fig = plt.figure(figsize=(18, 8.6))
plt.subplots_adjust(left=0.01, bottom=0.01, right=1.12, top=0.99)

m = Basemap(projection='robin', lon_0=0, llcrnrlat=-60, urcrnrlat=85, llcrnrlon=-180, urcrnrlon=180, resolution='l')
m.drawmapboundary()

#########################################################################################
# color country shapes
m.readshapefile('ne_110m_admin_0_countries', name='world', drawbounds=True, color='gray')

countries = []
undefined_countries = []
populationList = []
for info, shape in zip(m.world_info, m.world):
    try:
        popu = population[info["ADM0_A3"]]  # Bevölkerung nach Country Code (daher in dictionary)
        popu_int = int(
            popu) / 1000000  # geteilt durch 1000000, damit man die Zahlen in Millionen angegeben kann, der Übersicht halber
    except:
        undefined_countries.append(Polygon(np.array(shape), True))
        continue

    countries.append(Polygon(np.array(shape), True))
    populationList.append(popu_int)

populationArray = np.array(populationList)
ticks = np.linspace(0, 1000, 14)

#########################################################################################
# colorbar
cm = LinearSegmentedColormap.from_list("cm",
                                       ["#81fcff", "#19ff19", "#e2f000", "#ffaa31", "#ff8e51", "#ff6969", "#8c0000",
                                        "#3c0000"])
p = PatchCollection(countries, alpha=0.5, zorder=3, cmap=cm)
p.set_array(populationArray)
p.set_clim([ticks.min(), ticks.max()])

plt.gca().add_collection(p)
cb = fig.colorbar(p, ticks=ticks, shrink=0.6, pad=0.02)

#########################################################################################
# set countries without data to lightgray
p2 = PatchCollection(undefined_countries, alpha=0.5, zorder=3,
                     cmap=LinearSegmentedColormap.from_list("lg", ["lightgray", "lightgray"]))
p2.set_array(np.ones((len(undefined_countries),)))
plt.gca().add_collection(p2)

#########################################################################################
# show
plt.title("World Population 2018 (in Millions)")
plt.savefig("test.jpeg")
plt.show()
