from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.util.resources import get_relative_temp_resource_path


def init_pipeline(data: StepData, pipeline_id: str, step_name: str, idx=None, config=None,
                  no_tmp_dir=False):
    config["job_name"] = data.get_config("job_name")

    if no_tmp_dir:
        config["attach_mode"] = "combined"
        config["output_path"] = data.get_config("output_path")
    else:
        config["attach_mode"] = "separate"
        config["output_path"] = get_relative_temp_resource_path("", data.data["_pipe_id"])

    if not idx is None:
        config["job_name"] = f"{config['job_name']}_subtask_{idx}"

    config = {**{}, **config}

    # Avoid mutual imports
    from visuanalytics.analytics.control.procedures.pipeline import Pipeline

    return Pipeline(data.data["_job_id"], pipeline_id, step_name, config, attach_mode=True, no_tmp_dir=no_tmp_dir)


def extend_out_config(sequence: dict, out_images, out_audios, out_audio_l):
    out_images.extend(sequence["out_images"])
    out_audios.extend(sequence["out_audios"])
    out_audio_l.extend(sequence["out_audio_l"])
