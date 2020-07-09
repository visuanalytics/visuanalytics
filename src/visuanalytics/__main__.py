from visuanalytics.analytics.control.scheduler.JsonScheduler import JsonScheduler
from visuanalytics.server import server
from visuanalytics.util import config_manager
from visuanalytics.util.init import init


def main():
    config = config_manager.get_config()

    if config["console_mode"]:
        # Run without Flask Server and with JSONScheduler
        config = config_manager.get_config()
        init(config)

        JsonScheduler("resources/jobs.json", config["steps_base_config"]).start()
    else:
        # Runt with Flask Server and DBScheduler
        app = server.create_app()
        app.run(debug=True)


if __name__ == '__main__':
    main()
