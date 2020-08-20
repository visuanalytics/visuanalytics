import matplotlib.pyplot as plt

# Daten zum Plotten
hoch = [11, 11, 12, 14, 18, 22, 20, 23, 23, 21, 20, 23, 11, 11, 16, 23, 24, 23, 15, 17, 18, 21, 22, 22, 16, 20, 22, 17,
        18, 16]
tief = [-5, -3, -2, 1, 1, 4, 6, 5, 6, 2, 5, 2, -2, -2, 1, 6, 8, 8, 5, 6, 7, 5, 3, 4, 2, 3, 6, 8, 7, 5]
tage = list(range(1, 31))

plt.plot(tage, hoch, ":r", tage, hoch, "or", tage, tief, ":b", tage, tief, "ob")
plt.xlabel("Tag im April 2020")
plt.ylabel("Temperatur in Grad Celsius")
plt.title("Temperaturen im April 2020")
plt.grid()
plt.show()
