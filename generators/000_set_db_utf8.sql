ALTER DATABASE test CHARACTER SET utf8 COLLATE utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS regions (
    name      varchar(40),
    country_id       integer
);

TRUNCATE TABLE regions;

