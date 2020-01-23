DROP DATABASE IF EXISTS zander;
CREATE DATABASE IF NOT EXISTS zander;
USE zander;

CREATE USER 'zander'@'%' IDENTIFIED WITH mysql_native_password BY 'Passwordzander321';
FLUSH PRIVILEGES;
GRANT SELECT ON zander.* TO zander@'%';
GRANT INSERT ON zander.* TO zander@'%';
GRANT UPDATE ON zander.* TO zander@'%';
GRANT DELETE ON zander.* TO zander@'%';

CREATE TABLE playerdata (
  id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  uuid VARCHAR(36),
  username VARCHAR(16),
  joined TIMESTAMP NOT NULL DEFAULT NOW(),
  deaths int DEFAULT 0,
  bedlocation POINT NULL
);
create index playerdata_username on playerdata (username);
INSERT INTO playerdata (uuid, username) VALUES ('f78a4d8d-d51b-4b39-98a3-230f2de0c670', 'CONSOLE');

CREATE TABLE gamesessions (
  id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  player_id INT NOT NULL DEFAULT 0,
  sessionstart TIMESTAMP NOT NULL DEFAULT NOW(),
  sessionend TIMESTAMP NULL,
  ipaddress VARCHAR(45),
  FOREIGN KEY (player_id) REFERENCES playerdata (id)
);
create index gamesessions_player_id on gamesessions (player_id);
create index gamesessions_sessionstart on gamesessions (sessionstart);
create index gamesessions_sessionend on gamesessions (sessionend);

-- CREATE TABLE gamepunishments (
--   id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
--   punisheduser_id INT NOT NULL DEFAULT 0,
--   punisher_id INT NOT NULL DEFAULT 0,
--   punishtype ENUM('KICK', 'BAN', 'TEMP BAN', 'MUTE', 'WARN', 'IP BAN'),
--   reason TEXT,
--   appealed ENUM('true', 'false'),
--   punishtimestamp TIMESTAMP NOT NULL DEFAULT NOW(),
--   FOREIGN KEY (punisheduser_id) REFERENCES playerdata (id),
--   FOREIGN KEY (punisher_id) REFERENCES playerdata (id)
-- );

CREATE TABLE discordpunishments (
  id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  punisheduser TEXT,
  punisheduserid TEXT,
  punisher TEXT,
  punisherid TEXT,
  punishtype ENUM('KICK', 'BAN', 'TEMP BAN', 'MUTE', 'WARN'),
  reason TEXT,
  appealed ENUM('true', 'false'),
  punishtimestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

-- CREATE TABLE gameapplications (
--   id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
--   uuid VARCHAR(32),
--   username VARCHAR(16),
--   email TEXT,
--   discordtag TEXT,
--   howdidyouhearaboutus TEXT,
--   otherinformation TEXT,
--   appstatus ENUM('ACCEPTED', 'DENIED', 'PROCESSING'),
--   submissiontimestamp TIMESTAMP NOT NULL DEFAULT NOW()
-- );

CREATE TABLE accounts (
  id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  username VARCHAR(16),
  password TEXT,
  status ENUM('ACTIVE', 'DISABLED')
);

-- This account should be removed immediately after setting up your own account.
INSERT INTO accounts (username, password, status) VALUES ("root", "$2y$10$lM.dzxCibg5lbeh6wNRKk.DVfkUOQ0ZsPqnbUstgQ0GDbsBFo7JQa", "ACTIVE");

-- CREATE TABLE `ipbans` (
--   ip VARCHAR(20) NOT NULL,
--   time TIMESTAMP NOT NULL,
--   punisher VARCHAR(16) NOT NULL,
--   reason TEXT NOT NULL,
--   active TINYINT(4) NOT NULL,
--   deactivater VARCHAR(16) NOT NULL,
--   PRIMARY KEY (ip)
-- );

CREATE TABLE events (
  id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  eventtitle TEXT,
  eventicon TEXT,
  eventdate TEXT,
  eventtime TEXT,
  eventinformation TEXT
);

CREATE TABLE servers (
  id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  name TEXT,
  description TEXT,
  disclaimer TEXT,
  ipaddress TEXT,
  playersonline TEXT,
  maxplayers TEXT
);

CREATE TABLE ccstreams (
  id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  channelname TEXT,
  channellink TEXT,
  streamtitle TEXT,
  status ENUM('ONLINE', 'OFFLINE')
);

CREATE TABLE ccvideos (
  id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  channelname TEXT,
  channellink TEXT
);
