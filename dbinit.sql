DROP DATABASE IF EXISTS zander;
CREATE DATABASE IF NOT EXISTS zander;
USE zander;

CREATE USER 'zander'@'%' IDENTIFIED WITH mysql_native_password BY 'Paswordzander321';
FLUSH PRIVILEGES;
GRANT SELECT ON zander.* TO zander@'%';
GRANT INSERT ON zander.* TO zander@'%';
GRANT UPDATE ON zander.* TO zander@'%';
GRANT DELETE ON zander.* TO zander@'%';

CREATE TABLE playerdata (
  id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  uuid VARCHAR(36),
  username VARCHAR(16),
  joined TIMESTAMP NOT NULL DEFAULT NOW()
);
create index playerdata_username on playerdata (username);
-- INSERT INTO playerdata (uuid, username) VALUES ('f78a4d8d-d51b-4b39-98a3-230f2de0c670', 'CONSOLE');

CREATE TABLE playerprofile (
  id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  playerid INT NOT NULL DEFAULT 0,
  twitter VARCHAR(15),
  youtube TEXT,
  instagram VARCHAR(30),
  facebook VARCHAR(50),
  snapchat VARCHAR(30),
  aboutpage TEXT,
  profilephotocover TEXT,
  FOREIGN KEY (playerid) REFERENCES playerdata (id)
);

CREATE TABLE playerregistration (
  id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  playerid INT NOT NULL DEFAULT 0,
  registrationtoken VARCHAR(32),
  registered BOOLEAN DEFAULT false,
  registereddiscordid VARCHAR(18),
  FOREIGN KEY (playerid) REFERENCES playerdata (id)
);

CREATE TABLE gamesessions (
  id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  playerid INT NOT NULL DEFAULT 0,
  sessionstart TIMESTAMP NOT NULL DEFAULT NOW(),
  sessionend TIMESTAMP NULL,
  ipaddress VARCHAR(45),
  server VARCHAR(50),
  FOREIGN KEY (playerid) REFERENCES playerdata (id)
);
create index gamesessions_playerid on gamesessions (playerid);
create index gamesessions_sessionstart on gamesessions (sessionstart);
create index gamesessions_sessionend on gamesessions (sessionend);

CREATE TABLE gamepunishments (
  id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  punisheduserid INT NOT NULL DEFAULT 0,
  punisherid INT NOT NULL DEFAULT 0,
  type VARCHAR(8),
  reason VARCHAR(50),
  appealed BOOLEAN,
  punishtimestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  appealpunishtimestamp TIMESTAMP NOT NULL,
  FOREIGN KEY (punisheduserid) REFERENCES playerdata (id),
  FOREIGN KEY (punisherid) REFERENCES playerdata (id)
);

CREATE TABLE discordpunishments (
  id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  punishedid VARCHAR(18),
  punisherid VARCHAR(18),
  punishtype VARCHAR(8),
  reason VARCHAR(50),
  appealed BOOLEAN,
  punishtimestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  appealpunishtimestamp TIMESTAMP NOT NULL
);

CREATE TABLE webaccounts (
  id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  playerid INT NOT NULL DEFAULT 0,
  password TEXT,
  status ENUM('ACTIVE', 'DISABLED'),
  FOREIGN KEY (playerid) REFERENCES playerdata (id)
);

-- This account should be removed immediately after setting up your own account.
-- INSERT INTO accounts (username, password, status) VALUES ("root", "$2y$10$lM.dzxCibg5lbeh6wNRKk.DVfkUOQ0ZsPqnbUstgQ0GDbsBFo7JQa", "ACTIVE");

-- CREATE TABLE accountspermissions (
--   id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
--   account_id INT NOT NULL DEFAULT 0,
--   admincontentcreator BOOLEAN DEFAULT false,
--   adminevents BOOLEAN DEFAULT false,
--   adminservers BOOLEAN DEFAULT false,
--   adminaccounts BOOLEAN DEFAULT false,
--   adminaccountscreate BOOLEAN DEFAULT false
--   adminaccountsdelete BOOLEAN DEFAULT false
--   adminaccountsdisable BOOLEAN DEFAULT false
--   adminaccountsreenable BOOLEAN DEFAULT false
--   adminstafftitle BOOLEAN DEFAULT false
-- );
--
-- -- This allows the root account to have access to all parts of the admin panel
-- INSERT INTO accountspermissions (account_id, admincontentcreator, adminevents, adminservers, adminaccounts, adminaccountspermissions) VALUES (0, true, true, true, true, true);

CREATE TABLE events (
  id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  eventtitle VARCHAR(100),
  eventicon TEXT,
  eventdatetime DATETIME,
  eventinformation TEXT
);

CREATE TABLE servers (
  id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  name VARCHAR(60),
  description TEXT,
  disclaimer TEXT,
  ipaddress TEXT,
  position VARCHAR(2)
);

CREATE TABLE ccstreams (
  id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  playerid INT NOT NULL DEFAULT 0,
  channelname TEXT,
  viewercount VARCHAR(10),
  status BOOLEAN,
  FOREIGN KEY (playerid) REFERENCES playerdata (id)
);

CREATE TABLE ccvideos (
  id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  playerid INT NOT NULL DEFAULT 0,
  channelid TEXT,
  FOREIGN KEY (playerid) REFERENCES playerdata (id)
);

CREATE TABLE votes (
  id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  username VARCHAR(16),
  service TEXT,
  time TIMESTAMP NOT NULL DEFAULT NOW()
);
