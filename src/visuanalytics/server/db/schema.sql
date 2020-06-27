--
-- File generated with SQLiteStudio v3.2.1 on Fr. Juni 26 12:48:48 2020
--
-- Text encoding used: UTF-8
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

DROP TABLE IF EXISTS job;
DROP TABLE IF EXISTS schedule;
DROP TABLE IF EXISTS steps;

-- Table: job
CREATE TABLE job (
    id    INTEGER PRIMARY KEY AUTOINCREMENT
                  UNIQUE
                  NOT NULL,
    steps INTEGER NOT NULL
                  REFERENCES steps (id) ON DELETE CASCADE
                                        ON UPDATE CASCADE
);


-- Table: job_config
CREATE TABLE job_config (
    id     INTEGER PRIMARY KEY AUTOINCREMENT
                   UNIQUE
                   NOT NULL,
    job_id INTEGER REFERENCES job (id) ON DELETE CASCADE
                                       ON UPDATE CASCADE
                   NOT NULL,
    [key]  TEXT    NOT NULL,
    value  TEXT    NOT NULL
);


-- Table: job_schedule
CREATE TABLE job_schedule (
    id          INTEGER PRIMARY KEY AUTOINCREMENT
                        NOT NULL
                        UNIQUE,
    job_id      INTEGER REFERENCES job (id) ON DELETE CASCADE
                                            ON UPDATE CASCADE
                        NOT NULL,
    schedule_id INTEGER REFERENCES schedule (id) ON DELETE RESTRICT
                                                 ON UPDATE CASCADE
                        NOT NULL
);


-- Table: schedule
CREATE TABLE schedule (
    id      INTEGER     PRIMARY KEY AUTOINCREMENT
                        UNIQUE
                        NOT NULL,
    date    DATE,
    time    TIME        NOT NULL,
    weekday INTEGER (0) CHECK (weekday >= 0 AND 
                               weekday <= 6),
    daily   BOOLEAN
);


-- Table: steps
CREATE TABLE steps (
    id             INTEGER PRIMARY KEY AUTOINCREMENT
                           UNIQUE
                           NOT NULL,
    name           VARCHAR NOT NULL
                           UNIQUE,
    json_file_name VARCHAR UNIQUE
                           NOT NULL
);


COMMIT TRANSACTION;
PRAGMA foreign_keys = on;