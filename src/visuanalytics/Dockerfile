FROM python:3.8-slim-buster

# install GCC
RUN apt-get update && apt-get install -y gcc g++

# install Requirements
COPY requirements.txt /tmp/
RUN pip install --no-cache-dir -r /tmp/requirements.txt

WORKDIR /

# Copy src
COPY . ./visuanalytics

CMD ["python", "-m", "unittest discover visuanalytics"]