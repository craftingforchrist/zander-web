# zander-web

# Introduction
Zander web is an addon to the main [zander](https://github.com/shadowolfyt/zander) project and this is the web server side part of the zander project.

## Features
### Players Page
The players page is basically a stats page where you can see the players stats and whether they are online or not, if you click their name it can take you to their profile page.

### Profiles
When a new player joins the server, they are entered into the database get a profile generated for them which they can see on the web. At this point in time the following features are implemented:
 - A fancy banner with their name and server status.
 - Displayable stats.

### Custom Links
Changing the links in the config.json, you can redirect to your own:
 - GitHub Issue Tracking page.
 - Discord Server.

### Rules
Using GitHub and pulling raw md data and formatting it into HTML and displaying it on the page.
The rules md content file can be changed in the config.json under rulesmd.
When updating and refreshing md data from a GitHub repo it may take more than 5 minutes.

### Development Pages
Using the GitHub API and pulling raw JSON data and formatting it into HTML and displaying it on the page. This takes the commit logs for both zander-web [/development/web] and zander [/development/plugin] and allows anyone to see the commit history on either project.
