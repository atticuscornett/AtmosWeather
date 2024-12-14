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
By downloading the repository files, you can build the latest code on your machine by following the instructions in the Development section.

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

### Notifications Don't Work On Some Linux Distros

Some Linux distros lack the components to support electron notifications. There is no current workaround for this issue known to me.

### Text To Speech Doesn't Work On Some Linux Distros

Some Linux distros lack the components to support text to speech. This can be solved by the user manually installing text to speech components.

# Development
Atmos Weather is primarily written in Svelte, JavaScript, and Java.
There are three versions of Atmos Weather: Android, Web, and Desktop.
The three versions share common code for the UI
but have different code for the backend and platform-specific features.

### Environment Setup
1. Install Node.js and npm
2. Run `npm install` in the root directory to install the necessary libraries.
3. Run `npm install` in the `electron` directory to install the necessary libraries for the desktop version.
4. Run `npm run watch` in the root directory to continuously build the web version.

### Web
New features should be written for the web version first, then copied and implemented for the other versions.
The web version code is the UI base shared between the desktop and Android versions.
As the majority of the code is shared between the three versions,
updates often only need to be made to the web version and then copied to the other versions without modification.

The Svelte code for the web version is in the `src` folder.
All non-Svelte code (such as JavaScript libraries and media) are in the `www` folder.

To view the web version, run `npm run watch` to build and open `www/index.html` in a browser.

### Desktop
The desktop version is built using Electron.
The Electron code is in the `electron` folder.
The Electron code is a wrapper around the web version with additional code for platform-specific features.
It is built for Windows, macOS, and Linux.

Before working on the desktop version, be sure to copy the code in the `www` folder to the `electron` folder.
(The `src` folder does not have to be copied, as the Svelte code is built into the `www` folder.)

To run the desktop version, run `npm start` in the `electron` folder.

### Android
The Android version is built using CapacitorJS, Java, and Android Studio.
The Android code is in the `android` folder.
Like the desktop version,
the Android version is a wrapper around the web version with additional code for platform-specific features.

Before working on the Android version, be sure to sync the Android version with the web version using `npx cap sync`.
This will automatically copy the web version code to the Android version.

To run the Android version, open the `android` folder in Android Studio and run the app on an emulator or physical device.




Development plans and progress can be viewed on the Atmos Weather Notion Site: https://atticuscornett.notion.site/atticuscornett/00bc25c1bb07405d9bbe8c8c33ad195a

###### This project was originally created for the 2022 Congressional App Challenge.
