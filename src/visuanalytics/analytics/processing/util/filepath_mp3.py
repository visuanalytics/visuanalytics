from gtts import gTTS

from visuanalytics.analytics.util import resources


def get_filepath_mp3(pipeline_id, text):
    tts = gTTS(text, lang='de')
    file_path = resources.new_temp_resource_path(pipeline_id, "mp3")
    tts.save(file_path)
    return file_path
