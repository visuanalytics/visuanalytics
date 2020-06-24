from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.util.step_errors import ImageError, raise_step_error


@raise_step_error(ImageError)
def generate_image_wordcloud(image: dict, prev_paths, presets: dict, step_data: StepData):
    assert False, "Not Implemented"
