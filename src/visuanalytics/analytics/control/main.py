import uuid

from visuanalytics.analytics.control.pipeline import Pipeline
from visuanalytics.analytics.control.procedures.weather import WeatherSteps


# TODO(Max) Implement (current just for testing)

def main():
    Pipeline(uuid.uuid4().hex, WeatherSteps({})).start()


if __name__ == "__main__":
    main()
