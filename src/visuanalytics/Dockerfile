# This Docker Container is just for CI Testing
FROM python:3.8-slim-buster

# install Requirements
COPY requirements.txt /tmp/
RUN pip install --no-cache-dir -r /tmp/requirements.txt

CMD ["python", "-m", "unittest discover visuanalytics"]