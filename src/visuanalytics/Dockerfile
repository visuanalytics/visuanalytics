FROM python:3.7.7-stretch

# install Requirements
COPY requirements.txt /tmp/
RUN pip install --no-cache-dir -r /tmp/requirements.txt

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
#EXPOSE 5000

CMD ["python", "visuanalytics"]
