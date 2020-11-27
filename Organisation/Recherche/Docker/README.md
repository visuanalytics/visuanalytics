# Docker

## Dockerfile

> Erstellen eines Images

```DOCKER
# Definiert das Grund-Image
FROM baseimage

# Quellcode zum Kopieren eines Images
COPY src dest

# Code bauen
RUN cmd

# Beim Start ausführen
CMD ["command"]

# Port von außerhalb annehmen
EXPOSE PORT
```

## Commands

### Build

```
Docker build -t IMAGE .
```

### RUN

Container erstellen und starten

```
Docker run IMAGE
```

Container erstellen

```
Docker container create IMAGE
```

Container starten

```
Docker start containerID
```

> Mit `--name` kann man einem Container einen Namen geben und diesen anstelle der ID verwenden (möglich bei `create` und `run`).

**RUN Options**

- `-d` -> Im Hintergrund starten

> Wieder stoppen mit `docker stop containerID`

- `-p HostPort:ImagePort` -> Weiterleitung des Ports

> Benötigt `expose` für Image-Port im **Dockerfile**.

- `--mount type=bind,source=/dir,target=/dir` -> Dateien des Host-Sytems an den Container binden

> Praktisch für **Development**

- `-i` -> `stdin` des Containers wird offen gehalten

## Docker Compose

> Zum Starten mehrerer Docker-Container

### docker-compose.yml

```DOCKER
# Config file version
version: '3'

# Conteiner
services:
  #Config erster Container
  con1:
    # path to Docker File
    build: .
    #Andere optionen
    ports:
      - HostPort:ImagePort
  con2:
    # Docker image
    image: IMAGE
    # Ordner einbinden
    volumes:
      - /dir:/dir
    # Docker Container von dem dieser Abhängig ist
    depents_on:
      - IMAGE
```

> Man kann entweder mit `build` einen Pfad zu einem Dockerfile angeben oder mit `image` ein schon vorhandenes Docker-Image (lokal oder auch online).

> Um über ein Netzwerk zwischen den Containern zu kommunizieren, kann man einfach als **Host** den Service-Namen verwenden (hier z.B. con1).

### Run

```
docker-compose up
```

**Compose Options**

- `-d` -> Im Hintergrund starten

> Wieder stoppen mit `docker-compose stop`
