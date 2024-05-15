const { app, BrowserWindow, Notification, Tray, Menu, net, dialog} = require('electron')
const { autoUpdater } = require("electron-updater")
const turf = require("@turf/turf")
const {checkPolygons} = require("./alert-checking");
global.win2 = null;
var weatherLocations;
var locationNames;
var locationCache;
var settings;
var cycleAt = 0;
var lastNetworkCheck = true;
let trayIcon = null;

dialog.showErrorBox = function(title, content) {
    console.log(`${title}\n${content}`);
};

const createWindow = () => {
const win = new BrowserWindow({
    width: 800,
    height: 600,
	icon: __dirname + "/img/icon.png",
	autoHideMenuBar: true,
	show: false
})
win2 = win;
  win.loadFile('index.html')
}

// Check if app is already running to prevent multiple background instances
const singleAppLock = app.requestSingleInstanceLock();
if (!singleAppLock){
	console.log("Lock.")
	app.quit();
}
else{
	// Run at system startup (TODO: Have a setting)
	app.setLoginItemSettings({
		openAtLogin: true
	})
	if (process.platform == "linux"){
		// Make desktop file for startup on Linux
		var fs = require("fs");
		fs.writeFile('/home/' + require("os").userInfo().username + '/.config/autostart/atmos-weather.desktop','[Desktop Entry]\nName=Atmos Weather\nExec="/opt/Atmos Weather/atmos-weather" %U\nTerminal=false\nType=Application\nIcon=atmos-weather\nStartupWMClass=Atmos Weather\nComment=A lightweight app for weather forecasts and alerts.\nCategories=Utility;', function(err){console.log(err)})	
	}
	app.on('second-instance', (event, commandLine, workingDirectory, additionalData) => {
		if (win2 == null){
			createWindow();
		}
		win2.show()
		if (win2.isMinimized()){
			win2.restore();
			win2.focus();
		}
	})
	app.whenReady().then(() => {
		if (process.platform === 'win32'){
			app.setAppUserModelId("Atmos Weather");
			autoUpdater.checkForUpdatesAndNotify()
		}
		createWindow()
		win2.webContents.executeJavaScript('localStorage.getItem("run-before")', true)
		.then(result => {
			if (!result){
				win2.show();
			}
		});
		trayIcon = new Tray(__dirname + "/img/icon.png")
		trayIcon.setToolTip('Atmos Weather')
		const trayMenuTemplate = [{
				   label: 'Atmos Weather',
				   enabled: true,
				   click: () => {
					if (win2 == null){
						win2 = new BrowserWindow({
							width: 800,
							height: 600,
							icon: __dirname + "/img/icon.png",
							autoHideMenuBar: true
						});
						win2.loadFile('index.html')
						win2.hide()
					}
					if (win2.isVisible()) {
						win2.hide()
					} else {
						// Refresh displayed weather data so that old data is not shown to the user
						win2.webContents.executeJavaScript('refreshLocations();', false);
						win2.show()
					}
				   }
				},
				{
				   label: 'About Atmos Weather',
				   enabled: true,
				   click: () => {
					if (win2 == null){
						win2 = new BrowserWindow({
							width: 800,
							height: 600,
							icon: __dirname + "/img/icon.png",
							autoHideMenuBar: true
						});
						win2.loadFile('index.html')
					}
					win2.show()
					win2.webContents.executeJavaScript("navTo('about');")
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
				// If window was destroyed, create a new one. Otherwise, show current window.
				if (win2 == null){
					win2 = new BrowserWindow({
						width: 800,
						height: 600,
						icon: __dirname + "/img/icon.png",
						autoHideMenuBar: true
					});
					win2.loadFile('index.html')
					win2.hide()
				}
				if (win2.isVisible()) {
					win2.hide()
				} else {
					// Refresh displayed weather data so that old data is not shown to the user
					win2.webContents.executeJavaScript('refreshLocations();', false);
					win2.show()
				}
			});

	})

	app.on("window-all-closed", () => {
		win2 = null;
	})
}

setInterval(function(){
	if (win2 == null){
		createWindow();
	}
	// Get app settings from window localStorage
	win2.webContents.executeJavaScript('localStorage.getItem("weather-locations");', true)
		.then(result => {
			global.weatherLocations = JSON.parse(result);
	});
	win2.webContents.executeJavaScript('localStorage.getItem("weather-location-names")', true)
		.then(result =>{
		global.locationNames = JSON.parse(result);
	});
	win2.webContents.executeJavaScript('localStorage.getItem("nws-location-cache")', true)
		.then(result =>{
		global.locationCache = JSON.parse(result);
	});
	win2.webContents.executeJavaScript('localStorage.getItem("atmos-settings")', true)
		.then(result => {
		global.settings = JSON.parse(result);
	});
	win2.webContents.executeJavaScript('navigator.onLine', true)
		.then(result => {
		global.isOnline = result;
	});
}, 10000);

setInterval(function(){
	checkLocation();
	cycleAt++;
}, 30000);

// Check the location for alerts
function checkLocation(){
	console.log(new Date().toString())
	let locationNames = global.locationNames;
	if (locationNames == undefined){
		setTimeout(checkLocation, 200);
		return;
	}
	if (cycleAt >= locationNames.length){
		cycleAt = 0;
	}
	if (locationNames.length > 0){
		checkPolygons();
	}
	if (win2 == null){
		win2 = new BrowserWindow({
			width: 800,
			height: 600,
			icon: __dirname + "/img/icon.png",
			autoHideMenuBar: true
		});
		win2.loadFile('index.html')
		win2.hide();
	}
	win2.webContents.executeJavaScript('localStorage.getItem("lastForecastNotification' + locationNames[cycleAt] + '");', true)
		.then(result => {
			var date = new Date();
			var dateString = date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear();
			if (result != dateString){
				var severeNotification =  settings["notifications"]["severe-future"];
				var rainNotification = settings["notifications"]["rain-future"];
				if (settings["per-location"][locationNames[cycleAt]] != undefined){
					if (settings["per-location"][locationNames[cycleAt]]["notifications"]["severe-future"] != undefined){
						severeNotification =  settings["per-location"][locationNames[cycleAt]]["notifications"]["severe-future"];
					}
					if (settings["per-location"][locationNames[cycleAt]]["notifications"]["rain-future"] != undefined){
						rainNotification =  settings["per-location"][locationNames[cycleAt]]["notifications"]["rain-future"];
					}
				}
				if (severeNotification || rainNotification){
					try{
						if (locationNames.length == 0){
							// Don't send garbage requests if there are no locations
							return;
						}
						var forecastLink = JSON.parse(locationCache[locationNames[cycleAt]])["properties"]['forecast'];
						var notificationRequest = net.request(forecastLink);
						notificationRequest.on("response", (response) => {
							response.on("data", (chunk) => {
								try{
									chunk = JSON.parse(chunk);
									var fullForecast = chunk["properties"]["periods"][0]["detailedForecast"] + " " + chunk["properties"]["periods"][1]["detailedForecast"];
									var fullForecastCaps = fullForecast;
									win2.webContents.executeJavaScript('localStorage.setItem("lastForecastNotification' + locationNames[cycleAt] + '", "' + dateString + '");')
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
					win2.webContents.executeJavaScript('localStorage.setItem("lastForecastNotification' + locationNames[cycleAt] + '", "' + dateString + '");')
				}
			}
	});
}

global.loadAlertE = (details) => {
	console.log(details)
	try{
		win2.webContents.executeJavaScript('stopAllAudio();', false);
		win2.webContents.executeJavaScript('loadAlert("' + details.cycleAt.toString() + '-' + details.at.toString() +  '")', false);
		win2.show()
	}
	catch(err){
		win2 = new BrowserWindow({
			width: 800,
			height: 600,
			icon: __dirname + "/img/icon.png",
			autoHideMenuBar: true
		});
		win2.loadFile('index.html')
		win2.webContents.executeJavaScript('stopAllAudio();', false);
		win2.webContents.executeJavaScript('loadAlert("' + details.cycleAt.toString() + '-' + details.at.toString() +  '")', false);
		win2.show()
	}
}