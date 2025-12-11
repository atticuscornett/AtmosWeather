const { app, BrowserWindow, Notification, Tray, Menu, net, dialog} = require('electron')
const { autoUpdater } = require("electron-updater")
const turf = require("@turf/turf")
const {checkPolygons} = require("./alert-checking");
const fs = require("fs");
global.mainWindow = null;
let weatherLocations;
let locationNames;
let locationCache;
let settings;
let cycleAt = 0;
let lastNetworkCheck = true;
let trayIcon = null;
let userAgentString = "Atmos Weather (Electron) Search (https://github.com/atticuscornett/AtmosWeather/issues)"


dialog.showErrorBox = function(title, content) {
    console.log(`${title}\n${content}`);
};

const createWindow = () => {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		icon: __dirname + "/img/icon.png",
		autoHideMenuBar: true,
		show: false
	})
	mainWindow.webContents.setUserAgent(userAgentString);

	mainWindow.webContents.setUserAgent('AtmosWeather/' + app.getVersion() + ' (Electron) (https://github.com/atticuscornett/AtmosWeather)');
  	mainWindow.loadFile('index.html')

    // Run in background instead of closing
    mainWindow.on('close', (e)=>{
        e.preventDefault();
        mainWindow.hide();
    })
}

// Check if app is already running to prevent multiple background instances
const singleAppLock = app.requestSingleInstanceLock();
if (!singleAppLock){
	console.log("Lock.")
	app.quit();
}
else{
    // Show window when a second instance is run
	app.on('second-instance', (event, commandLine, workingDirectory, additionalData) => {
		mainWindow.show()
		if (mainWindow.isMinimized()){
			mainWindow.restore();
			mainWindow.focus();
		}
	})


	app.whenReady().then(() => {
        // Check for updates on Windows only (autoUpdater not supported on Linux/Mac)
		if (process.platform === 'win32'){
			app.setAppUserModelId("Atmos Weather");
			autoUpdater.checkForUpdatesAndNotify()
		}

        createWindow();

        // Show main window if first run, otherwise keep in tray
		mainWindow.webContents.executeJavaScript('localStorage.getItem("run-before")', true)
		.then(result => {
			if (!result){
				mainWindow.show();
			}
		});


		trayIcon = new Tray(__dirname + "/img/icon.png")
		trayIcon.setToolTip('Atmos Weather')
		const trayMenuTemplate = [
            {
                label: 'Atmos Weather',
				enabled: true,
				click: () => {
				if (mainWindow == null){
					mainWindow = new BrowserWindow({
						width: 800,
						height: 600,
						icon: __dirname + "/img/icon.png",
						autoHideMenuBar: true
					});
					mainWindow.webContents.setUserAgent(userAgentString);
					mainWindow.loadFile('index.html')
					mainWindow.hide()
				}
				if (mainWindow.isVisible()) {
					mainWindow.hide()
				} else {
					// Refresh displayed weather data so that old data is not shown to the user
					mainWindow.webContents.executeJavaScript('refreshLocations();', false);
					mainWindow.show()
				}
                }
				},
            {
                label: 'About Atmos Weather',
				enabled: true,
                click: () => {
                    mainWindow.show()
					mainWindow.webContents.executeJavaScript("window.goPage('about');")
                }
            },
            {
                label: 'Quit',
				enabled: true,
				click: () => {
					app.quit()
				}
            }
        ]

        let trayMenu = Menu.buildFromTemplate(trayMenuTemplate)
        trayIcon.setContextMenu(trayMenu)

        trayIcon.on('click', function(e){
            if (mainWindow.isVisible()) {
				mainWindow.hide()
			} else {
				// Refresh displayed weather data so that old data is not shown to the user
				mainWindow.webContents.executeJavaScript('refreshLocations();', false);
				mainWindow.show()
			}
        });

	})
}

setInterval(function(){
	// Get app settings from window localStorage
	mainWindow.webContents.executeJavaScript('localStorage.getItem("weather-locations");', true)
		.then(result => {
			global.weatherLocations = JSON.parse(result);
	});
	mainWindow.webContents.executeJavaScript('localStorage.getItem("weather-location-names")', true)
		.then(result =>{
		global.locationNames = JSON.parse(result);
	});
	mainWindow.webContents.executeJavaScript('localStorage.getItem("nws-location-cache")', true)
		.then(result =>{
		global.locationCache = JSON.parse(result);
	});
	mainWindow.webContents.executeJavaScript('localStorage.getItem("atmos-settings")', true)
		.then(result => {
		global.settings = JSON.parse(result);
		runAtStartup();
	});
	mainWindow.webContents.executeJavaScript('navigator.onLine', true)
		.then(result => {
		global.isOnline = result;
	});
}, 10000);

function runAtStartup(){
	let shouldRunAtStartup = true;
	if (global.settings !== undefined){
		if (global.settings["personalization"] !== undefined){
			if (global.settings["personalization"]["run-startup"] !== undefined){
				shouldRunAtStartup = global.settings["personalization"]["run-startup"];
			}
		}
	}

	console.log("Should run at startup: " + shouldRunAtStartup)

	app.setLoginItemSettings({
		openAtLogin: shouldRunAtStartup
	})
	if (process.platform === "linux" && shouldRunAtStartup){
		// Make desktop file for startup on Linux
		var fs = require("fs");
		fs.writeFile('/home/' + require("os").userInfo().username + '/.config/autostart/atmos-weather.desktop','[Desktop Entry]\nName=Atmos Weather\nExec="/opt/Atmos Weather/atmos-weather" %U\nTerminal=false\nType=Application\nIcon=atmos-weather\nStartupWMClass=Atmos Weather\nComment=A lightweight app for weather forecasts and alerts.\nCategories=Utility;', function(err){console.log(err)})
	}
}

function alertCheckHandler(){
	checkLocation();
	cycleAt++;
	let locationCheckFrequency = 30*1000;
	if (global.settings !== undefined){
		if (global.settings["location-alerts"] !== undefined){
			if (global.settings["location-alerts"]["alert-check-frequency"] !== undefined){
				locationCheckFrequency = Number(global.settings["location-alerts"]["alert-check-frequency"])*1000;
			}
		}
	}
	console.log("Check frequency: " + locationCheckFrequency)
	setTimeout(alertCheckHandler, locationCheckFrequency);
}

alertCheckHandler();

// Check the location for alerts
function checkLocation(){
	console.log(new Date().toString())

	// Wait for main window to load settings
	let locationNames = global.locationNames;
	if (locationNames === undefined){
		setTimeout(checkLocation, 200);
		return;
	}

	if (cycleAt >= locationNames.length){
		cycleAt = 0;
	}

	if (locationNames.length > 0){
		checkPolygons();
	}


	// Check if future forecast notifications are enabled
	mainWindow.webContents.executeJavaScript('localStorage.getItem("lastForecastNotification' + locationNames[cycleAt] + '");', true)
		.then(result => {
			let date = new Date();
			let dateString = date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear();
			if (result !== dateString){
				// Get default notification settings
				let severeNotification =  settings["notifications"]["severe-future"];
				let rainNotification = settings["notifications"]["rain-future"];

				// Override with per-location settings if they exist
				if (settings["per-location"][locationNames[cycleAt]]){
					if (settings["per-location"][locationNames[cycleAt]]["notifications"]["severe-future"] !== undefined){
						severeNotification =  settings["per-location"][locationNames[cycleAt]]["notifications"]["severe-future"];
					}
					if (settings["per-location"][locationNames[cycleAt]]["notifications"]["rain-future"] !== undefined){
						rainNotification =  settings["per-location"][locationNames[cycleAt]]["notifications"]["rain-future"];
					}
				}

				// Send notification if enabled
				if (severeNotification || rainNotification){
					try{
						if (locationNames.length === 0){
							// Don't send garbage requests if there are no locations
							return;
						}

						// Check forecast using NWS API
						let forecastLink = JSON.parse(locationCache[locationNames[cycleAt]])["properties"]['forecast'];
						let notificationRequest = net.request(forecastLink);
						notificationRequest.on("response", (response) => {
							response.on("data", (chunk) => {
								try{
									chunk = JSON.parse(chunk);
									var fullForecast = chunk["properties"]["periods"][0]["detailedForecast"] + " " + chunk["properties"]["periods"][1]["detailedForecast"];
									var fullForecastCaps = fullForecast;
									mainWindow.webContents.executeJavaScript('localStorage.setItem("lastForecastNotification' + locationNames[cycleAt] + '", "' + dateString + '");')
									fullForecast = fullForecast.toLowerCase();
									// Check for severe trigger words
									if (fullForecast.includes("severe") || fullForecast.includes("tropical") || fullForecast.includes("hurricane") || fullForecast.includes("strong") || fullForecast.includes("tornado") || fullForecast.includes("damaging") || fullForecast.includes("damage") || fullForecast.includes("hail")){
										new Notification({ title: "Future severe weather expected at " + locationNames[cycleAt], body: fullForecastCaps, icon: __dirname + "/img/icon.png"}).show();
									}
									else{
										if (rainNotification){
											// Check rain trigger words
											if (fullForecast.includes("rain") || fullForecast.includes("storm")){
												new Notification({ title: "Future rain/storms expected at " + locationNames[cycleAt], body: fullForecastCaps, icon: __dirname + "/img/icon.png"}).show();
											}
										}
									}
								}
								catch(err){
									console.log("There was an error getting the forecast.")
								}
							})
						})
						notificationRequest.on("error", (error)=>{
							// Decide if should give offline notification (TODO - Add offline notification settings)
							if (error.message == "net::ERR_NETWORK_IO_SUSPENDED"){
								console.log("Computer is going to sleep.")
							}
							else{
								if (lastNetworkCheck){
									lastNetworkCheck = false;
									console.log("Computer is now offline.")
								}
							}
						})
						notificationRequest.end()
					}
					catch (err){
						console.log(err)
					}
				}
				else{
					mainWindow.webContents.executeJavaScript('localStorage.setItem("lastForecastNotification' + locationNames[cycleAt] + '", "' + dateString + '");')
				}
			}
	});
}

global.loadAlertE = (details) => {
	console.log(details)
	try{
		mainWindow.webContents.executeJavaScript('stopAllAudio();', false);
		mainWindow.show()
		console.log('loadAlert("' + details.locationName + '", ' + details.at.toString() +  ')');
		mainWindow.webContents.executeJavaScript('loadAlert("' + details.locationName + '", ' + details.at.toString() +  ')', false);
	}
	catch(err){
		mainWindow = new BrowserWindow({
			width: 800,
			height: 600,
			icon: __dirname + "/img/icon.png",
			autoHideMenuBar: true
		});
		mainWindow.webContents.setUserAgent(userAgentString);
		mainWindow.loadFile('index.html')
		mainWindow.webContents.executeJavaScript('stopAllAudio();', false);
		mainWindow.show()
		mainWindow.webContents.executeJavaScript('loadAlert("' + details.cycleAt.toString() + '-' + details.at.toString() +  '")', false);
	}
}