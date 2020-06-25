from visuanalytics.analytics.control.procedures.step_data import StepData
from visuanalytics.analytics.processing.image.visualization import generate_all_images


def prepare_image_test(values: list, data, config=None):
    if config is None:
        config = {}

    step_data = StepData(config, "1")
    step_data.init_data({"_req": data})
    values = {"images": values}
    step_data.data["_pipe_id"] = 100
    generate_all_images(values, step_data)

    return values["images"]


def prepare_overlay_test(values, data, config=None):
    if config is None:
        config = {}

    step_data = StepData(config, "0")
    step_data.init_data({"_test": data})
    values = {"images": {"testbild": {"type": "pillow",
                                      "path": "Test_Bild_1.png",
                                      "overlay": [values]}},
              "presets": {"test_preset": {
                  "color": "black",
                  "font_size": 20,
                  "font": "Test_Font.ttf"
              }, }}
    step_data.data["_pipe_id"] = "100"
    generate_all_images(values, step_data, True)

    return values["images"]["testbild"]


def prepare_draw_test(values, data, config=None):
    if config is None:
        config = {}

    step_data = StepData(config, "0")
    step_data.init_data({"_test": data})
    values = {"images": {"testbild": {"type": "pillow",
                                      "path": "Test_Bild_1.png",
                                      "overlay": [{
                                          "type": "text",
                                          "anchor_point": values,
                                          "pos_x": 100,
                                          "pos_y": 50,
                                          "preset": "test_preset",
                                          "pattern": "Test"
                                      }, ]}},
              "presets": {"test_preset": {
                  "color": "black",
                  "font_size": 20,
                  "font": "Test_Font.ttf"
              }, }}
    step_data.data["_pipe_id"] = "100"
    generate_all_images(values, step_data, True)

    return values["images"]["testbild"]
