DROP DATABASE IF EXISTS zander;
CREATE DATABASE IF NOT EXISTS zander;
USE zander;

-- CREATE USER 'zander'@'%' IDENTIFIED WITH mysql_native_password BY 'Passwordzander321';
-- FLUSH PRIVILEGES;
-- GRANT SELECT ON zander.* TO zander@'%';
-- GRANT INSERT ON zander.* TO zander@'%';
-- GRANT UPDATE ON zander.* TO zander@'%';
-- GRANT DELETE ON zander.* TO zander@'%';

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
  steam VARCHAR(32),
  github VARCHAR(40),
  facebook VARCHAR(50),
  snapchat VARCHAR(30),
  discord TEXT,
  aboutpage TEXT,
  coverart VARCHAR(64),
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
  appealpunishtimestamp DATETIME,
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
  appealpunishtimestamp DATETIME
);

CREATE TABLE webaccounts (
  id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  playerid INT NOT NULL DEFAULT 0,
  email VARCHAR(200),
  password TEXT,
  registrationtoken VARCHAR(32),
  registered BOOLEAN DEFAULT 0,
  disabled BOOLEAN DEFAULT 0,
  FOREIGN KEY (playerid) REFERENCES playerdata (id)
);

-- This account should be removed immediately after setting up your own account.
-- INSERT INTO accounts (username, password, status) VALUES ("root", "$2y$10$lM.dzxCibg5lbeh6wNRKk.DVfkUOQ0ZsPqnbUstgQ0GDbsBFo7JQa", "ACTIVE");

-- CREATE TABLE accountspermissions (
--   id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
--   account_id INT NOT NULL DEFAULT 0,
--   admincontentcreator BOOLEAN DEFAULT 0,
--   adminevents BOOLEAN DEFAULT 0,
--   adminservers BOOLEAN DEFAULT 0,
--   adminaccounts BOOLEAN DEFAULT 0,
--   adminaccountscreate BOOLEAN DEFAULT 0
--   adminaccountsdelete BOOLEAN DEFAULT 0
--   adminaccountsdisable BOOLEAN DEFAULT 0
--   adminaccountsreenable BOOLEAN DEFAULT 0
--   adminstafftitle BOOLEAN DEFAULT 0
-- );
--
-- -- This allows the root account to have access to all parts of the admin panel
-- INSERT INTO accountspermissions (account_id, admincontentcreator, adminevents, adminservers, adminaccounts, adminaccountspermissions) VALUES (0, 1, 1, 1, 1, 1);

CREATE TABLE events (
  id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  title TEXT,
  icon TEXT,
  eventdatetime DATETIME,
  information TEXT
);

CREATE TABLE servers (
  id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  name TEXT,
  icon VARCHAR(100),
  description TEXT,
  disclaimer TEXT,
  ipaddress TEXT,
  position VARCHAR(2),
  visable BOOLEAN DEFAULT 1,
  playersonline TEXT
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

CREATE TABLE indexslides (
  id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  title VARCHAR(100),
  bannerimage VARCHAR(100),
  bannerimagealttext VARCHAR(100),
  description VARCHAR(200),
  buttontext VARCHAR(50),
  buttonstyle VARCHAR(50),
  linkreference VARCHAR(200),
  position VARCHAR(2),
  visable BOOLEAN DEFAULT 1
);

INSERT INTO indexslides (title, bannerimage, bannerimagealttext, description, buttontext, buttonstyle, linkreference, position, visable) VALUES
  ("Welcome!", "./img/bannerimg/bannerimg01.png", "A wheat field with a windmill.", "Crafting For Christ is a Christian Minecraft Server, offering a place to play Minecraft with a awesome community!", "Play!", "btn-primary", "/play", 1, 1),
  ("Church During COVID", "./img/bannerimg/bannerimg02.png", "The inside of a church.", "During this difficult time it is hard and tricky to gather together as God's people. We have collated a list of churches in our community that stream their services and post their sermons online.", "Watch & Listen", "btn-primary", "/churchduringcovid", 2, 1),
  ("Community Events", "./img/bannerimg/bannerimg03.png", "The layout of a map used in community events.", "From PvP, to Survival, to various other events, we host community events to get everyone involved!", "What's On?", "btn-primary", "/events", 3, 1),
  ("Community Discord", "./img/bannerimg/bannerimg04.png", "A blurred background of the Community Discord.", "Chat and get to know the community by joining the community Discord! Be notified about Network announcements and events.", "Join Discord", "btn-primary", "/discord", 4, 1),
  ("Voting", "./img/bannerimg/bannerimg05.png", "An image of the Top Voter in the Hall of Patrons.", "Help the Server grow and the community by considering to vote for the Server, Top Voter of each month gets cool perks!", "Vote", "btn-primary", "/vote", 5, 1),
  ("Forums", "./img/bannerimg/bannerimg06.png", "A blurred background of the Community Forums.", "Chat with the community and post your creations on our Forums!", "Visit", "btn-primary", "/forums", 6, 1);