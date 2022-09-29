const { app, BrowserWindow, Notification, Tray, Menu, net, dialog} = require('electron')
const { autoUpdater } = require("electron-updater")
var win2 = null;
var weatherLocations;
var locationNames;
var locationCache;
var settings;
var notifiedAlerts = [];
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
				   enabled: false
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
			weatherLocations = JSON.parse(result);
	});
	win2.webContents.executeJavaScript('localStorage.getItem("weather-location-names")', true)
		.then(result =>{
		locationNames = JSON.parse(result);
	});
	win2.webContents.executeJavaScript('localStorage.getItem("nws-location-cache")', true)
		.then(result =>{
		locationCache = JSON.parse(result);
	});
	win2.webContents.executeJavaScript('localStorage.getItem("atmos-settings")', true)
		.then(result => {
		settings = JSON.parse(result);
	});
	win2.webContents.executeJavaScript('navigator.onLine', true)
		.then(result => {
		isOnline = result;
	});
	setTimeout(checkLocation, 100);
	cycleAt++;
}, 10000);

// Check the location for alerts
function checkLocation(){
	if (locationNames == undefined){
		setTimeout(checkLocation, 200);
		return;
	}
	if (cycleAt >= locationNames.length){
		cycleAt = 0;
	}
	if (locationNames.length > 0){
		alertCheck("https://api.weather.gov/alerts/active?point=" + weatherLocations[cycleAt]["lat"] + "," + weatherLocations[cycleAt]["lon"]);
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

function loadAlertE(event, arg){
	try{
		win2.webContents.executeJavaScript('stopAllAudio();', false);
		win2.webContents.executeJavaScript('loadAlert("' + this.cycleAt.toString() + '-' + this.at.toString() +  '")', false);
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
		win2.webContents.executeJavaScript('loadAlert("' + this.cycleAt.toString() + '-' + this.at.toString() +  '")', false);
		win2.show()
	}
	
}

// Check the location at for alerts
function alertCheck(urlGet){
	var request = net.request(urlGet);
	request.on("response", (response) => {
		lastNetworkCheck = true;
		response.on('data', (chunk) => {
			if (!notifiedAlerts){
				notifiedAlerts = [];
			}
			chunk = JSON.parse(chunk);
			chunk = chunk["features"];
			var at = 0;
			let playedAlready = [];
			while (at < chunk.length){
				// Get Alert Settings
				if (!notifiedAlerts.includes(chunk[at]["id"])){
					console.log(locationNames[cycleAt])
					var eventType = chunk[at]["properties"]["event"];
					if (eventType.includes("Red Flag Warning")){
						eventType = "Fire Weather Warning";
					}
					var notificationSetting = "soundnotification";
					var notificationSound = settings["location-alerts"]["default-notification"];
					var alertSound = settings["location-alerts"]["default-alert"];
					eventType = eventType.toLowerCase().replaceAll(" ", "-");
					if (eventType == "special-weather-statement"){
						eventType = "special-weather-statement-advisory";
					}
					if (eventType == "severe-weather-statement"){
						eventType = "severe-weather-statement-advisory";
					}
					if (eventType == "tropical-cyclone-statement"){
						eventType = "tropical-cyclone-statement-advisory";
					}
					if (eventType == "hurricane-local-statement"){
						eventType = "hurricane-local-statement-advisory";
					}
					if (eventType == "marine-weather-statement"){
						eventType = "marine-weather-statement-advisory";
					}
					if (eventType == "rip-current-statement"){
						eventType = "rip-current-statement-advisory";
					}
					if (eventType == "coastal-flood-statement"){
						eventType = "coastal-flood-advisory";
					}
					if (eventType == "beach-hazards-statement"){
						eventType = "beach-hazards-statement-advisory";
					}
					if (eventType == "hazardous-weather-outlook"){
						eventType = "hazardous-weather-outlook-advisory";
					}
					if (eventType == "air-quality-alert"){
						eventType = "air-quality-warning";
					}
					console.log(eventType);
					let tts = settings["location-alerts"]["tts-alerts"];
					if (eventType.includes("warning")){
						notificationSetting = settings["alert-types"]["warnings"][eventType.replace("-warning", "")];
					}
					else if (eventType.includes("watch")){
						notificationSetting = settings["alert-types"]['watches'][eventType.replace("-watch", "")];
					}
					else{
						notificationSetting = settings["alert-types"]["advisory"][eventType.replace("-advisory", "")];
					}
					// Check if has location specific settings
					if (settings["per-location"][locationNames[cycleAt]] != undefined){
						if (eventType.includes("warning")){
							if (settings["per-location"][locationNames[cycleAt]]["alert-types"]["warnings"][eventType.replace("-warning", "")] != undefined){
								notificationSetting = settings["per-location"][locationNames[cycleAt]]["alert-types"]["warnings"][eventType.replace("-warning", "")];
							}
						}
						else if (eventType.includes("watches")){
							if (settings["per-location"][locationNames[cycleAt]]["alert-types"]["watches"] != undefined){
								notificationSetting = settings["per-location"][locationNames[cycleAt]]["alert-types"]["watches"][eventType.replace("-watch", "")];
							}
							notificationSetting = settings["alert-types"]["watches"][eventType.replace("-watch", "")];
						}
						else{
							if (settings["per-location"][locationNames[cycleAt]]["alert-types"]["advisory"][eventType.replace("-advisory", "")] != undefined){
								notificationSetting = settings["per-location"][locationNames[cycleAt]]["alert-types"]["advisory"][eventType.replace("-advisory", "")];	
							}
						}
						if (settings["per-location"][locationNames[cycleAt]]["location-alerts"]["default-notification"] != undefined){
							notificationSound = settings["per-location"][locationNames[cycleAt]]["location-alerts"]["default-notification"];
						}
						if (settings["per-location"][locationNames[cycleAt]]["location-alerts"]["default-alert"] != undefined){
							alertSound = settings["per-location"][locationNames[cycleAt]]["location-alerts"]["default-alert"];
						}
					}
					if (notificationSetting == undefined){
						notificationSetting = "soundnotification";
					}
					if (notificationSetting == "alert"){
						if (settings["per-location"][locationNames[cycleAt]] != undefined){
							if (settings["per-location"][locationNames[cycleAt]]["location-alerts"] != undefined){
								if (settings["per-location"][locationNames[cycleAt]]["location-alerts"]["tts-alerts"] != undefined){
									tts = settings["per-location"][locationNames[cycleAt]]["location-alerts"]["tts-alerts"];
								}
							}
						}
						var notif = new Notification({ title: chunk[at]["properties"]["event"] + " issued for " + locationNames[cycleAt], body: chunk[at]["properties"]["description"], urgency: "critical", timeoutType: 'never', silent: true, sound: __dirname + "/audio/readynownotification.mp3", icon: __dirname + "/img/warning.png"});
						notif.show()
						notif.on('click', loadAlertE.bind({"cycleAt":cycleAt, "at":at}))
						win2.webContents.executeJavaScript("var audio = new Audio('audio/" + alertSound + "extended.mp3');audio.play();allAudio.push(audio);", false);
						notif.on('close', (event, arg) => {win2.webContents.executeJavaScript("stopAllAudio();", false)});
						if (tts){
							ttsTask(chunk[at]["properties"]["headline"] + ". " + chunk[at]["properties"]["description"].replaceAll("'", "\\'"));
						}
					}
					else if (notificationSetting == "silentnotification"){
						var notif = new Notification({ title: chunk[at]["properties"]["event"] + " issued for " + locationNames[cycleAt], body: chunk[at]["properties"]["description"], urgency: "critical", timeoutType: 'never', silent: true, sound: __dirname + "/audio/readynownotification.mp3", icon: __dirname + "/img/alerts.png"});
						notif.show()
						notif.on('click', loadAlertE.bind({"cycleAt":cycleAt, "at":at}))
					}
					else if (notificationSetting == "soundnotification"){
						if (chunk[at]["properties"]["event"].toLowerCase().includes("watch")){
							var notif = new Notification({ title: chunk[at]["properties"]["event"] + " issued for " + locationNames[cycleAt], body: chunk[at]["properties"]["description"], silent: true, icon: __dirname + "/img/watch.png"});
							notif.show()
							notif.on('click', loadAlertE.bind({"cycleAt":cycleAt, "at":at}))
							notif.on('close', (event, arg) => {win2.webContents.executeJavaScript("stopAllAudio();", false)});
						}
						else{
							var notif = new Notification({ title: chunk[at]["properties"]["event"] + " issued for " + locationNames[cycleAt], body: chunk[at]["properties"]["description"], silent: true, icon: __dirname + "/img/alerts.png"});
							notif.show()
							notif.on('click', loadAlertE.bind({"cycleAt":cycleAt, "at":at}))
							notif.on('close', (event, arg) => {win2.webContents.executeJavaScript("stopAllAudio();", false)});
						}
						if (!playedAlready.includes(notificationSound)){
							win2.webContents.executeJavaScript("var audio = new Audio('audio/" + notificationSound + "notification.mp3');audio.play();allAudio.push(audio);", false);
							playedAlready.push(notificationSound);
						}
					}
					locationNames[cycleAt]
					console.log(notificationSetting);
					notifiedAlerts.push(chunk[at]["id"]);
				}
				at++;
			}
		})
	})
	request.on("error", (error)=>{
		// Decide if should give offline notification (TODO - Add offline notification settings)
		if (error.message == "net::ERR_NETWORK_IO_SUSPENDED"){
			console.log("Computer is going to sleep.")
		}
		else{
			if (lastNetworkCheck){
				lastNetworkCheck = false;
				console.log("Computer is now offline.")
				new Notification({title: "Cannot give weather alerts.", body: "Atmos Weather could not successfully contact the NWS API. This is usually because you have no internet.", icon: __dirname + "/img/icon.png"}).show()
			}
		}
	})
	request.end();
}

function ttsTask(toSay){
	setTimeout(function(){
		win2.webContents.executeJavaScript("stopAllAudio();", false);
		toSay = toSay.replaceAll("\n", " ")
		console.log(toSay);
		win2.webContents.executeJavaScript("sayTTS('" +  toSay + "');", false);
	}, 3000);
}