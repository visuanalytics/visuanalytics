from visuanalytics.analytics.control.procedures.step_data import StepData


def init_pipeline(data: StepData, pipeline_id: str, step_name: str, idx=None, config=None,
                  no_tmp_dir=False):
    config["job_name"] = data.get_config("job_name")
    config["out_path"] = data.get_config("output_path")

    if no_tmp_dir:
        config["attach_mode"] = "combined"
    else:
        config["attach_mode"] = "separate"

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
