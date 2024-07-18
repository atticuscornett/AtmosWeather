![Atmos Weather](https://raw.githubusercontent.com/atticuscornett/AtmosWeather/main/logo.svg)
## The cross-platform, lightweight app for weather forecasts and alerts across the US
Available for Windows, MacOS, Linux, and Android at the [Atmos Weather Website](https://atticuscornett.github.io/AtmosWeather)

[![GitHub license](https://img.shields.io/github/license/atticuscornett/AtmosWeather)](https://github.com/atticuscornett/AtmosWeather/blob/main/LICENSE)
![GitHub all releases](https://img.shields.io/github/downloads/atticuscornett/atmosweather/total)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/atticuscornett/atmosweather)
![GitHub last commit](https://img.shields.io/github/last-commit/atticuscornett/atmosweather)
![GitHub deployments](https://img.shields.io/github/deployments/atticuscornett/atmosweather/github-pages?label=github%20pages)

Available for Android on IzzyOnDroid

[![IzzyOnDroid](https://img.shields.io/endpoint?url=https://apt.izzysoft.de/fdroid/api/v1/shield/io.atticusc.atmosweather)](https://apt.izzysoft.de/fdroid/index/apk/io.atticusc.atmosweather)

GitHub Actions

[![Build for Linux](https://github.com/atticuscornett/AtmosWeather/actions/workflows/linux-builder.yml/badge.svg)](https://github.com/atticuscornett/AtmosWeather/actions/workflows/linux-builder.yml)
[![Build for MacOS](https://github.com/atticuscornett/AtmosWeather/actions/workflows/main.yml/badge.svg)](https://github.com/atticuscornett/AtmosWeather/actions/workflows/main.yml)

### Table of Contents
[Features](#features)

[Installation](#installation)

[Project Goals](#goals)

[Major Issues](#issues)

[Development](#development)

# Features

### Mobile and Desktop Platforms
Atmos Weather is available on both Windows and Android.
Unlike most weather apps, Atmos also provides weather alerts to users on desktop.

### Total Control
Atmos Weather gives you complete control over weather alerts. Choose multiple locations to receive alerts from. Choose alert priority on both an alert type and a location basis.

### More Information
Atmos Weather gives you more information about weather warnings.
Instead of a text-based warning, Atmos generates a map of warning polygons.
It also includes any instructions and details provided by the National Weather Service API.

### Reliable Data
Atmos Weather uses the official National Weather Service API to provide the most accurate and up to date warnings possible.

# Installation

## Stable Version

### Website
The easiest way to install Atmos Weather is by using the website: [Atmos Weather Website](https://atticuscornett.github.io/AtmosWeather).

Download the version for your platform and run the installer.

### GitHub Releases
You can download stable versions from the releases on GitHub.

## Beta Versions (Unstable, Power Users)

### GitHub Releases
Some beta version builds will be added to GitHub releases.



## Latest Code (Unstable, Not Recommended)
By downloading the repository files, you can build the latest code on your machine using CapacitorJS (for the Android version) or using Electron in the `electron` folder (for all desktop versions).
Node and npm are required to build the latest code.

To run Electron version:
1. Download node libraries with `npm install`
2. Run the app with `npm start`

To run Android version:
1. Sync the project with `npx cap sync`
2. Build and run the app in Android Studio.

# <a name="goals"></a>Project Goals
### Minimum Bloat
Most weather apps have too much bloat, largely in the form of overwhelming ads. Atmos Weather aims to be as lightweight as possible, providing function without a big footprint.

### Timely Alerts
Weather alerts should be given in a timely manner. Ideally, alerts should be given within one minute of being published to the NWS API.

### Functionality
Atmos Weather should provide all the basic functions needed by users, as well as improve in areas that most weather apps and emergency alerts fall short, such as lack of information and customizability for weather alerts.

### Privacy and Security
Atmos Weather should not collect any user data beyond what is strictly necessary to provide functionality.
Atmos Weather's privacy policy should be transparent and easy to understand. Atmos Weather's privacy statment
can be viewed [here](https://atticuscornett.github.io/AtmosWeather/privacy.html).

# <a name="issues"></a>Major Known Issues

### US Only

Because it uses the National Weather Service API, Atmos Weather only supports locations in the US.

### Battery Warning On Certain Samsung Models

Samsung marks Atmos Weather as a high battery user, because it wakes up the phone often to check for weather alerts.
This can mean automatic throttling of weather checks, leading to late alerts.
Despite this warning, Atmos Weather has not been observed to use more than 1-2% a day on these models.
At the moment, the only solution is to allow background battery usage and disable battery optimizing for the app.
This solves the negative performance impacts, but does not get rid of the warning.

### Notifications Don't Work On Some Linux Distros

Some Linux distros lack the components to support electron notifications. There is no current workaround for this issue known to me.

### Text To Speech Doesn't Work On Some Linux Distros

Some Linux distros lack the components to support text to speech. This can be solved by the user manually installing text to speech components.

# Development
Atmos Weather is written in HTML, CSS, JavaScript, and Java. Atmos Weather uses CapacitorJS to build for multiple platforms.

Development plans and progress can be viewed on the Atmos Weather Notion Site: https://atticuscornett.notion.site/atticuscornett/00bc25c1bb07405d9bbe8c8c33ad195a

###### This project was originally created for the 2022 Congressional App Challenge.
