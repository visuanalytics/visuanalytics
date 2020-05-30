from visuanalytics.analytics.processing.util import mp3 as fp


def get_all_audios(pipeline_id, data, date):
    return [_generate_audio(pipeline_id, data[1]),
            _generate_audio(pipeline_id, data[2]),
            _generate_audio(pipeline_id, data[3]),
            _generate_audio(pipeline_id, data[4])]


def _generate_audio(pipeline_id, data):
    """
    :param pipeline_id:
    :param data: [teaser_1, teaser_2, date_string]
    :param date: wurde in preprocessing.history.transform.get_date erstellt [date[10], historical_year, years_ago]
    :return:
    """
    text = (
        f"Heute vor {data['years_ago']} war das Jahr {data['year']}. "
        f"Ein Thema war damals: {data['teaser_1']}. "
        f"Ein weiteres Thema war damals: {data['teaser_2']}. "
    )
    print(text)
    file_path = fp.text_to_mp3(pipeline_id, text)
    return file_path
