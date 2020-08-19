# Asynchrone API-Requests

Um die Abfrage von API-Requests zu beschleunigen, 
kann man diese asynchron ausführen. Dies ist für einen Request natürlich langsamer, 
ab zwei aber schon schneller, umso mehr requests man macht, umso größer wird der Unterschied,
da man ungefähr in der Zeit von einem synchronen Request alle asynchronen machen kann.

> z.B. bei unseren 19 API-Requests an die weatherbit-API für den deutschlandweiten Wetterbericht 
> ist die asynchrone Variante 7 Sekunden schneller.

Möglicher Code:

~~~
import asyncio
from aiohttp import ClientSession


async def _fetch(url, session):
    async with session.get(url) as response:
        return await response.json()


async def _fetch_array(urls):
    async with ClientSession() as session:
        tasks = await asyncio.gather(
            *[_fetch(url, session) for url in urls]
        )

        return tasks


def fetch_all(urls):
    loop = asyncio.get_event_loop()
    task = loop.create_task(_fetch_array(urls))
    loop.run_until_complete(task)
    return task.result()
~~~

Der Funktion `fetch_all` übergibt man eine Liste von URLs und diese macht dann alle Requests und man bekommt eine Liste mit den Ergebnissen zurück.

> Der Code wurde noch nicht eingebaut, da man eine weitere Dependency benötigt 
> und noch nicht ganz sicher ist, ob man diese Funktion häufiger benötigt.