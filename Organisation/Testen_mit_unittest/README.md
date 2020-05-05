# Testing in Python

Zum Schreiben von Unit-Tests stellt Pythons Standard-Bibliothek [unittest](https://docs.python.org/3/library/unittest.html) zur Verfügung.

Hier ist ein simples Beispiel für den Umgang mit der Test-Bibliothek:

1. Wir definieren im Modul "sum_fun.py" folgende (zu testende) Funktionen zur Berechnung der Summe aller geraden bzw. ungeraden Zahlen in einer Liste.
    ```python
    def sum_even(l):
        return sum(filter(even, l))

    def sum_uneven(l):
        return sum(filter(uneven, l))
    ```

2. Wir erstellen das Modul ("sum_test.py"), das die Tests enthalten soll. Je Testfall wird eine Klasse erstellt, welche von unittest.TestCase erbt. In diesem Beispiel haben wir nur einen Testfall (Klasse Test_Sum_Fun). Innerhalb der Klasse definieren wir nun die einzelnen Test-Methoden; damit diese auch automatisch beim Starten des Tests ausgeführt werden, müssen ihre Namen mit "test" beginnen. Zentrale Komponente der Test-Funktionen sind die `asserts`: Diese bestimmen, ob der Test durchläuft oder fehlschlägt.  
    ```python
    import unittest
    import sum_fun

    class Test_Sum_Methods(unittest.TestCase):

        def test_sum_even(self):
            expected = 6
            actual = sum_fun.sum_even([1, 2, 3, 4, 5])
            self.assertEqual(expected, actual)

        def test_sum_uneven(self):
            expected = 9
            actual = sum_fun.sum_uneven([1, 2, 3, 4, 5])
            self.assertEqual(expected, actual)

        def test_sum_even_uneven(self):
            l = [1,2,3,4,5]
            expected = sum(l)
            actual = sum_fun.sum_even(l) + sum_fun.sum_uneven(l)
            self.assertEqual(expected, actual, "Sum of even and uneven numbers should equal the sum of all numbers in a list")
    ```
    Die wahrscheinlich wichtigste `assert`-Funktion ist `assertEqual`: Diese nimmt zwei Werte an und wirft eine Exception (d.h., der Test schlägt fehl) wenn sie unterschiedlich sind. Um den Fehler genauer zu beschreiben, lässt sich als optionaler Parameter zusätzlich ein Text angeben, der ausgegeben wird, wenn der Test fehlschlägt.

3. (optional) Um die im Modul enthaltenen Tests auch von der Kommandozeile ausführen zu können, fügen wir folgende Anweisung hinzu:
    ```python
    if __name__ == '__main__':
        unittest.main()
    ```
    Unsere Tests lassen sich dann von der Kommandozeile aus so ausführen: 
    ```
    python -m unittest test sum_test
    python -m unittest sum_test.Test_Sum_Fun
    python -m unittest sum_test.Test_Sum_Fun.test_sum_even
    ```

4. Um die Tests in PyCharm auszuführen: Rechtsklick auf das Testmodul im Projektverzeichnis und dann "Run unit tests in ..." auswählen.