# Docker

## Dockerfile

> erstellen eines Images

```DOCKER
# Definiert das Grund Image
FROM baseimage

# Quellcode zum Image Copieren
COPY src dest

# code bauen
RUN cmd

# Beim Start Ausführen
CMD ["command"]

# Port von ausserhalb annehmen
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

> mit **--name** kann man einen container einen Namen vergeben und diesen anstelle der id verwenden (geht bei create und run)

**RUN Options**

- `-d` -> Im hintergrund Starten

> wieder stopen mit `docker stop containerID`

- `-p HostPort:ImagePort` -> Port weiterleitung

> Benötigt expose für ImagePort im **Dockerfile**

- `--mount type=bind,source=/dir,target=/dir` -> Dateien des Host Sytemes an den Contaier Binden

> Praktich für **Development**

- ´-i´ -> stdin des containers wird offen gehalten

## Docker Compose

> Zum starten mehrerer Docker Container

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

> Mann kann entweder mit `build` ein path zu einem DockerFile angeben oder mit `image` ein schon Vorhandenes Docker image (local oder auch online)

> Um überes netzwerk zwichen den Containern zu Komunizieren kann man einfach als **Host** den Service namen verwenden (hier z.B. con1)

### Run

```
docker-compose up
```

**Compose Options**

- `-d` -> Im hintergrund Starten

> wieder stopen mit `docker-compose stop`
