def get_all_audios_single_city(pipeline_id, data, date, cityname):
    return [_generate_first_day_audio(pipeline_id, data['cities'][cityname][0], date[0], cityname),
            _generate_second_day_audio(pipeline_id, data['cities'][cityname][1], date[1], cityname),
            _generate_third_day_audio(pipeline_id, data['cities'][cityname][2], date[2], cityname),
            _generate_fourth_day_audio(pipeline_id, data['cities'][cityname][3], date[3], cityname),
            _generate_five_day_audio(pipeline_id, data['cities'][cityname][4], date[4], cityname)]


def _generate_first_day_audio(pipeline_id, data, date, cityname):
    pass


def _generate_second_day_audio(pipeline_id, data, date, cityname):
    pass


def _generate_third_day_audio(pipeline_id, data, date, cityname):
    pass


def _generate_fourth_day_audio(pipeline_id, data, date, cityname):
    pass


def _generate_five_day_audio(pipeline_id, data, date, cityname):
    pass
