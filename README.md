![Atmos Weather](https://raw.githubusercontent.com/atticuscornett/AtmosWeather/main/logo.svg)
## The lightweight app for weather forecasts and alerts.

### Table of Contents
[Features](#features)

[Installation](#installation)

[Project Goals](#goals)

[Major Issues](#issues)

[Documentation](#documentation)

[Development](#development)

# Features

### Mobile and Desktop Platforms
Atmos Weather is available on both Windows and Android.
Unlike most weather apps, Atmos also provides weather alerts to users on desktop.

### Total Control
Atmos Weather gives you complete control over weather alerts. Choose multiple locations to recieve alerts from. Choose alert priority on both an alert type and a location basis.

### More Information
Atmos Weather gives you more information about weather warnings.
Instead of a text-based warning, Atmos generates a map of warning polygons.
It also includes any instructions and details provided by the National Weather Service API.

### Reliable Data
Atmos Weather uses the official National Weather Service API to provide the most accurate and up to date warnings possible.

# Installation

## Stable Version

### Website
The easiest way to install Atmos Weather is by using the website: [Atmos Weather Website](https://atticuscornett.github.io/atmos-weather).
Download the version for your platform and run the installer.

### GitHub Releases
You can download stable versions from the releases on GitHub.

### Build Folder
You can download stable versions from the build folder on Github.

## Beta Versions (Unstable, Power Users)

### GitHub Releases
Some beta version builds will be added to GitHub releases.

## Latest Builds (Unstable, Not Recommended)
You can download the latest builds for individual platforms from the appropriate build locations for Cordova in the platforms folder. These builds (especially Android builds, which may not be full builds) may be broken.

## Latest Code (Unstable, Not Recommended)
By downloading the repository files, you can build the latest code on your machine using Cordova.

# <a name="goals"></a>Project Goals
### Minimum Bloat
Most weather apps have too much bloat, largely in the form of overwelming ads. Atmos Weather aims to be as lightweight as possible, providing function without a big footprint.

### Timely Alerts
Weather alerts should be given in a timely manner. Ideally, alerts should be given within one minute of being published to the NWS API.

### Functionality
Atmos Weather should provide all of the basic functions needed by users, as well as improve in areas that most weather apps and emergency alerts fall short, such as lack of information and customizability for weather alerts.

### Privacy and Security
Atmos Weather should not collect any user data beyond what is strictly necessary to provide functionality.

# <a name="issues"></a>Major Known Issues

### Battery Warning On Certain Samsung Models
Samsung marks Atmos Weather as a high battery user, because it wakes up the phone often to check for weather alerts.
This can mean automatic throttling of weather checks, leading to late alerts.
Despite this warning, Atmos Weather has not been observed to use more than 1-2% a day on these models.

# Documentation

Most of the cross-platform Cordova codebase (found in the www folder) is well documented through comments, although more details may be desirable. At this time, however, there is insufficient documentation for much of the platform specific code (especially Android java files.) There are future plans to better document the code to make forking and contributing to this project easier.

# Development
Atmos Weather is written in HTML, CSS, JavaScript, and Java. Atmos Weather uses Apache Cordova to build for multiple platforms.
At the moment, Atmos Weather is primarily developed by Atticus Cornett (me), however, I would love to expand this project over time with multiple contributors. If you have feature ideas or want to work on this project, don't hesitate to reach out.
Development plans and progress and be viewed on the Atmos Weather Notion Site: https://atticuscornett.notion.site/atticuscornett/00bc25c1bb07405d9bbe8c8c33ad195a

###### This project was originally created for the 2022 Congressional App Challenge.
