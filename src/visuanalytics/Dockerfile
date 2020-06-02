FROM jrottenberg/ffmpeg:3.3-nvidia

# install Python
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3.8 \
    python3-setuptools\
    python3-pip

# install Requirements
COPY requirements.txt /tmp/
RUN pip3 install --no-cache-dir -r /tmp/requirements.txt

# Change User
RUN useradd --create-home appuser
WORKDIR /home/appuser
USER appuser

# Copy src
COPY --chown=appuser . ./visuanalytics

# Flask Server Currently not used in Build mode
# Set Env for flask
#ENV FLASK_APP=visuanalytics.server.server:create_app

# Expose Server Post
# EXPOSE 5000

# Reset Entry point from Base image
ENTRYPOINT []

CMD ["python3", "-m", "visuanalytics"]
