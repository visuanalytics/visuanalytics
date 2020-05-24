def get_all_images_single_city(pipeline_id, data, date, city_name):
    return [_generate_first_day_image(pipeline_id, data[city_name][0], date[0], city_name),
            _generate_second_day_image(pipeline_id, data[city_name][1], date[1], city_name),
            _generate_third_day_image(pipeline_id, data[city_name][2], date[2], city_name),
            _generate_fourth_day_image(pipeline_id, data[city_name][3], date[3], city_name),
            _generate_five_day_image(pipeline_id, data[city_name][4], date[4], city_name)]


def _generate_first_day_image(pipeline_id, data, date, city_name):
    pass


def _generate_second_day_image(pipeline_id, data, date, city_name):
    pass


def _generate_third_day_image(pipeline_id, data, date, city_name):
    pass


def _generate_fourth_day_image(pipeline_id, data, date, city_name):
    pass


def _generate_five_day_image(pipeline_id, data, date, city_name):
    pass
