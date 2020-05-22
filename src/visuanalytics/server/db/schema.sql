PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

DROP TABLE IF EXISTS job;
DROP TABLE IF EXISTS schedule;
DROP TABLE IF EXISTS steps;

-- Table: job
CREATE TABLE job
(
    id    INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL,
    steps INTEGER UNIQUE                           NOT NULL
);

-- Table: schedule
CREATE TABLE schedule
(
    id      INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE               NOT NULL,
    job_id REFERENCES job (id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
    date    DATE,
    time    TIME                                                   NOT NULL,
    weekday INTEGER(0) CHECK (weekday >= 0 and weekday <= 6),
    daily   BOOLEAN
);

-- Table: steps
CREATE TABLE steps
(
    id   INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL,
    name VARCHAR                                  NOT NULL UNIQUE
);


COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
