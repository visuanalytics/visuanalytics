# Recherche Aufbereitung von Daten/Datenvisualisierung mit Python
## Bibliotheken für die Datenanalyse

Quelle: https://www.analyticsvidhya.com/blog/2016/01/complete-tutorial-learn-data-science-python-scratch-2/

Following are a list of libraries, you will need for any scientific computations and data analysis:

**NumPy** stands for Numerical Python. The most powerful feature of NumPy is n-dimensional array. This library also contains basic linear algebra functions, Fourier transforms,  advanced random number capabilities and tools for integration with other low level languages like Fortran, C and C++

**SciPy** stands for Scientific Python. SciPy is built on NumPy. It is one of the most useful library for variety of high level science and engineering modules like discrete Fourier transform, Linear Algebra, Optimization and Sparse matrices.

**Matplotlib** for plotting vast variety of graphs, starting from histograms to line plots to heat plots.. You can use Pylab feature in ipython notebook (ipython notebook –pylab = inline) to use these plotting features inline. If you ignore the inline option, then pylab converts ipython environment to an environment, very similar to Matlab. You can also use Latex commands to add math to your plot.

**Pandas** for structured data operations and manipulations. It is extensively used for data munging and preparation. Pandas were added relatively recently to Python and have been instrumental in boosting Python’s usage in data scientist community.

**Scikit** Learn for machine learning. Built on NumPy, SciPy and matplotlib, this library contains a lot of efficient tools for machine learning and statistical modeling including classification, regression, clustering and dimensionality reduction.

**Statsmodels** for statistical modeling. Statsmodels is a Python module that allows users to explore data, estimate statistical models, and perform statistical tests. An extensive list of descriptive statistics, statistical tests, plotting functions, and result statistics are available for different types of data and each estimator.

**Seaborn** for statistical data visualization. Seaborn is a library for making attractive and informative statistical graphics in Python. It is based on matplotlib. Seaborn aims to make visualization a central part of exploring and understanding data.

**Bokeh** for creating interactive plots, dashboards and data applications on modern web-browsers. It empowers the user to generate elegant and concise graphics in the style of D3.js. Moreover, it has the capability of high-performance interactivity over very large or streaming datasets.

**Blaze** for extending the capability of Numpy and Pandas to distributed and streaming datasets. It can be used to access data from a multitude of sources including Bcolz, MongoDB, SQLAlchemy, Apache Spark, PyTables, etc. Together with Bokeh, Blaze can act as a very powerful tool for creating effective visualizations and dashboards on huge chunks of data.

**Scrapy** for web crawling. It is a very useful framework for getting specific patterns of data. It has the capability to start at a website home url and then dig through web-pages within the website to gather information.

**SymPy** for symbolic computation. It has wide-ranging capabilities from basic symbolic arithmetic to calculus, algebra, discrete mathematics and quantum physics. Another useful feature is the capability of formatting the result of the computations as LaTeX code.

**Requests** for accessing the web. It works similar to the the standard python library urllib2 but is much easier to code. You will find subtle differences with urllib2 but for beginners, Requests might be more convenient.

**Additional libraries, you might need:**

**os** for Operating system and file operations

**networkx** and **igraph** for graph based data manipulations

**regular expressions** for finding patterns in text 

**BeautifulSoup** for scrapping web. It is inferior to Scrapy as it will extract information from just a single webpage in a run.

### Folium
Scheint eine Art Vermittler zu sein, damit man eine Leaflet Map in Python erstellen kann.

https://leafletjs.com/

folium builds on the data wrangling strengths of the Python ecosystem and the mapping strengths of the Leaflet.js library. Manipulate your data in Python, then visualize it in a Leaflet map via folium.

### Plotly und Plotly Express

Interaktive Grafiken

https://plotly.com/python/

Fundamentals, Basic Charts, Statistical Charts, Scientific Charts, Financial Charts, Maps, 3D Charts, Subplots, Jupyter Widgets Interaction (Click Events in Python), Transforms, Add Custom Controls (Custom Buttons, Sliders, Dropdown Menus, Range Slider and Selector), Animations, Chart Studio Integration (Online Plotting möglich mit kostenfreiem Account, Chart Studio provides a web-service for hosting graphs)
Bubble Map mit Animation Zum Beispiel: Verbreitung einer Krankheit, wenn Maus drüber (hovern), dann kann man noch mehr Infos über ein Fensterchen erhalten. 

https://plotly.com/python/bubble-maps/ (scroll to: Bubble Map with animation, das könnte man bestimmt in ein Video rendern)

https://plotly.com/python/map-subplots-and-small-multiples/ (z. B. Ausbreitung Krankheit möglich, mehrere gleiche Landkarten mit unterschiedlichen Daten füllen)

https://plotly.com/python/figure-factory-subplots/  Horizontal oder vertikal: Tabellen und Diagramme untereinander, nebeneinander
(z.B. Höchst- und Tiefwerte von Temperaturen über einen bestimmten Zeitraum, sowohl in einer Tabelle als auch in einem Diagramm zur direkten Visualisierung)

https://plotly.com/python/mixed-subplots/ (z.B. Ausbreitung auf Weltkarte darstellen (aus verschiedenen Winkeln betrachten (-> animieren) und Diagramme daneben mit Fallzahl, Genesene, etc.)

https://plotly.com/python/figurewidget/ -> Figure Widget, quasi Veränderung der Daten in verschiedenen Grafiken, 

### Dash 

Produktives Python Framework zum Erstellen von Web Anwendungen. Dash Apps werden im Webbrowser gerendet

https://dash.plotly.com/introduction

### ArcPy arcgispro-py3

Folgende Internetseite wurde mit arcgis erstellt: https://experience.arcgis.com/experience/478220a4c454480e823b17327b2bf1d4
Um ArcPy verwenden zu können benötigt man ArcGIS Pro, und das ist nicht kostenfrei.

### Basemap

https://www.datadependence.com/2016/06/creating-map-visualisations-in-python/

### Pandas

Pandas ist eine Software-Bibliothek die für Python geschrieben wurde. Sie wird für Daten-Manipulation und -Analyse verwendet. Sie stellt spezielle Funktionen und Datenstrukturen zur Verfügung für die Manipulation von numerischen Tabellen und Zeit-Serien. Pandas ist eine freie Software und wurde unter der Drei-Klausel-BSD-Lizenz veröffentlicht. 
(https://www.python-kurs.eu/pandas.php)

### Matplotlib

https://matplotlib.org/gallery/index.html

GUI: Currently matplotlib supports wxpython, pygtk, tkinter and pyqt4/5. 
Watermark: Using a PNG file as a watermark. In Plot möglich, wenn man mehrere Plots hintereinander hängt (als Animation), dann ist bestimmt auch ein Wasserzeichen in Animation möglich.

### Pygal

http://www.pygal.org/en/stable/documentation/types/maps/pygal_maps_world.html -> Darstellung von Weltkarte mit gefärbten Ländern

http://www.pygal.org/en/stable/index.html 

auch Histogramme und weitere Diagrammtypen darstellbar, ähnlich wie matplotlib. 

### Beispiel für COVID19-Übersicht

https://covid19.datanomiq.de/ 

Daten aus https://gitlab.com/datanomiqopensource/covid19_db

Verwendete Sprache und Libraries: R programming language

Layout mit Flexdashboard package: https://rmarkdown.rstudio.com/flexdashboard/ 

Plotly: https://plotly.com/  

Leaflet.js: https://leafletjs.com/  -> Videos darstellen in Bildausschnitt auf Website und Web Map wie google Maps auf manchen Seiten zum Ranzoomen etc. implementiert ist

Highcharts: https://www.highcharts.com/ 

Es gibt außerdem Highstock, Highmaps und Highcharts Gantt -> nicht kostenfrei 
http://www.ggplot2.org/

