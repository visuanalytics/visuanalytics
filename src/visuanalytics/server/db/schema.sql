--
-- File generated with SQLiteStudio v3.2.1 on Sa. Aug. 15 15:27:09 2020
--
-- Text encoding used: UTF-8
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: job
DROP TABLE IF EXISTS job;

CREATE TABLE job
(
    job_id   INTEGER PRIMARY KEY AUTOINCREMENT
        UNIQUE
                     NOT NULL,
    job_name VARCHAR NOT NULL,
    type     VARCHAR CHECK (type IN ("daily", "weekly", "interval", "on_date") )
                     NOT NULL,
    date     DATE,
    time     TIME
);


-- Table: job_config
DROP TABLE IF EXISTS job_config;

CREATE TABLE job_config
(
    job_config_id INTEGER PRIMARY KEY AUTOINCREMENT
        UNIQUE
                       NOT NULL,
    [key]         TEXT NOT NULL,
    value         TEXT NOT NULL,
    type          VARCHAR CHECK (type IN ("string", "number", "multi_string", "multi_number", "boolean", "enum",
                                          "sub_params") ),
    position_id   INTEGER REFERENCES job_topic_position (position_id) ON DELETE CASCADE
        ON UPDATE CASCADE
                       NOT NULL
);


-- Table: job_logs
DROP TABLE IF EXISTS job_logs;

CREATE TABLE job_logs
(
    job_logs_id     INTEGER PRIMARY KEY AUTOINCREMENT
                        NOT NULL
        UNIQUE,
    job_id          BIGINT REFERENCES job (job_id) ON DELETE CASCADE
        ON UPDATE CASCADE
                        NOT NULL,
    state           INT NOT NULL,
    error_msg       TEXT,
    error_traceback TEXT,
    duration        INT,
    start_time      DATETIME
);


-- Table: job_topic_position
DROP TABLE IF EXISTS job_topic_position;

CREATE TABLE job_topic_position
(
    position_id INTEGER PRIMARY KEY
        UNIQUE
        NOT NULL,
    job_id      INTEGER REFERENCES job (job_id) ON DELETE CASCADE
        ON UPDATE CASCADE
        NOT NULL,
    steps_id    INTEGER REFERENCES steps (steps_id) ON DELETE CASCADE
        ON UPDATE CASCADE
        NOT NULL,
    position    INTEGER CHECK (position >= 0)
        NOT NULL
);


-- Table: schedule
DROP TABLE IF EXISTS schedule;

CREATE TABLE schedule
(
    schedule_id INTEGER PRIMARY KEY AUTOINCREMENT
        UNIQUE
                     NOT NULL,
    date        DATE,
    time        TIME NOT NULL,
    type        VARCHAR CHECK (type IN ("daily", "weekly", "on_date") )
                     NOT NULL
);


-- Table: schedule_weekday
DROP TABLE IF EXISTS schedule_weekday;

CREATE TABLE schedule_weekday
(
    schedule_weekday_id INTEGER PRIMARY KEY
        UNIQUE
                                   NOT NULL,
    weekday             INTEGER(1) NOT NULL
        CHECK (weekday >= 0 AND
               weekday <= 6),
    job_id REFERENCES job (job_id) ON DELETE CASCADE
        ON UPDATE CASCADE
                                   NOT NULL
);


-- Table: steps
DROP TABLE IF EXISTS steps;

CREATE TABLE steps
(
    steps_id       INTEGER PRIMARY KEY AUTOINCREMENT
        UNIQUE
                           NOT NULL,
    steps_name     VARCHAR NOT NULL
        UNIQUE,
    json_file_name VARCHAR UNIQUE
                           NOT NULL
);


COMMIT TRANSACTION;
PRAGMA foreign_keys = on;