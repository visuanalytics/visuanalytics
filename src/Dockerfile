# Build React Frontend
FROM node:14.15.1-buster-slim as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY frontend/package.json ./
COPY frontend/package-lock.json ./
RUN npm ci --silent
COPY frontend/. ./
RUN npm run build

# Build Production Container
FROM jrottenberg/ffmpeg:4.2-nvidia

# Set Timezone
ENV TZ="Europe/Berlin"
RUN apt-get update \
    && apt-get install -y --no-install-recommends\
    tzdata

# install Python
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    gcc g++ \
    python3.8 \
    python3-setuptools\
    python3-dev \
    python3-pip

# install Requirements
COPY visuanalytics/requirements.txt /tmp/
RUN pip3 install --no-cache-dir -r /tmp/requirements.txt

# create links to subfolders to make the names shorter when mouting
RUN ln -s /home/appuser/visuanalytics/out /out; \
    ln -s /home/appuser/visuanalytics/instance/config.json /config.json; \
    ln -s /home/appuser/visuanalytics/resources/jobs.json /jobs.json; \
    ln -s /home/appuser/visuanalytics/instance/visuanalytics.db /visuanalytics.db

# Add User
RUN useradd --create-home appuser
WORKDIR /home/appuser
USER appuser

# Copy src
COPY --chown=appuser visuanalytics ./visuanalytics

# -- Copy React Build --

# Copy index.html to templates
COPY --chown=appuser --from=build /app/build/index.html ./visuanalytics/server/templates/index.html
# Copy other files to static
COPY --chown=appuser --from=build /app/build ./visuanalytics/server/static
# Remove index.html from static files
RUN rm ./visuanalytics/server/static/index.html

# Create instance Folder
RUN mkdir /home/appuser/visuanalytics/instance

# Create volumes
VOLUME /home/appuser/visuanalytics/out
VOLUME /home/appuser/visuanalytics/instance
VOLUME /home/appuser/visuanalytics/resources/audio
VOLUME /home/appuser/visuanalytics/resources/images
VOLUME /home/appuser/visuanalytics/resources/memory

LABEL maintainer="VisuAnalytics"
LABEL org.opencontainers.image.authors="VisuAnalytics"

# Set FONTCONFIG_PATH
ENV FONTCONFIG_PATH=/etc/fonts

# Expose Server Post
EXPOSE 8000

# Reset Entry point from Base image
ENTRYPOINT []

# Run gunicorn Server
CMD ["gunicorn", "-b", "0.0.0.0:8000", "visuanalytics.server.server:create_app()"]
