# Async-Api-Requests

Um die Abfrage von api requests zu beschleunigen 
kann man diese asynchron ausführen. Dies ist für einen Request natürlich langsamer, 
ab zwei aber schon schneller um so mehr requests man macht umso größer wird der unterschied,
da man ungefähr in der zeit von einem syncronen Request alle Asyncronen machen kann.

> z.B. bei unseren 19 API requests an die Weather Api für den Deutschlandweiten wetterbericht 
>ist die asyncrone variante 7 sekunden schneller.

Möglicher Code:

~~~Python
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

Der Funktion fetch_all übergibt man eine Liste von urls und diese macht dann alle requests und man bekommt eine liste mit den ergebnissen zurück.

> Der code wurde noch nicht eingebaut da man eine weitere dependencie benötigt 
>und noch nicht ganz sicher ist ob man diese funtion häufiger benötig.