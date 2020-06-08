from visuanalytics.analytics.transform.transform import transform_add_symbol
from visuanalytics.analytics.transform.transform import transform_alias
from visuanalytics.analytics.transform.transform import transform_append
from visuanalytics.analytics.transform.transform import transform_array
from visuanalytics.analytics.transform.transform import transform_date_format
from visuanalytics.analytics.transform.transform import transform_date_now
from visuanalytics.analytics.transform.transform import transform_date_weekday
from visuanalytics.analytics.transform.transform import transform_loop
from visuanalytics.analytics.transform.transform import transform_replace
from visuanalytics.analytics.transform.transform import transform_select
from visuanalytics.analytics.transform.transform import transform_select_range


def todo(value, data):
    assert False, "Not Implemented"


TRANSFORM_TYPES = {
    "transform_array": transform_array,
    "select": transform_select,
    "select_range": transform_select_range,
    "append": transform_append,
    "add_symbol": transform_add_symbol,
    "replace": transform_replace,
    "alias": transform_alias,
    "date_format": transform_date_format,
    "date_weekday": transform_date_weekday,
    "date_now": transform_date_now,
    "loop": transform_loop
}
