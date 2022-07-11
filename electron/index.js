const { app, BrowserWindow, Notification, Tray, Menu, net} = require('electron')
var win2 = null;
var weatherLocations;
var locationNames;
var locationCache;
var settings;
var notifiedAlerts = [];
var cycleAt = 0;
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
const singleAppLock = app.requestSingleInstanceLock();
if (!singleAppLock){
	app.quit();
}
else{
	app.setLoginItemSettings({
		openAtLogin: true
	})
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
		}
		createWindow()
		let trayIcon = new Tray(__dirname + "/img/icon.png")
		trayIcon.setToolTip('Atmos Weather')
		const trayMenuTemplate = [{
				   label: 'Atmos Weather',
				   enabled: false
				},
				{
				   label: 'About Atmos Weather',
				   enabled: true
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
					win2.webContents.executeJavaScript('refreshLocations();', false);
					win2.show()
				}
			});

	})

	app.on("window-all-closed", () => {
		win2 = null;
	})

	function sendNotif (theTitle, theBody) {
		new Notification({ title: theTitle, body: theBody }).show()
	}
}

setInterval(function(){
	if (win2 == null){
		createWindow();
	}
//	win2.webContents.executeJavaScript('localStorage.getItem("notified-alerts");', true)
//		.then(result => {
//			notifiedAlerts = JSON.parse(result);
//	  	});
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
	win2.webContents.executeJavaScript('localStorage.getItem("lastForecastNotification' + locationNames[cycleAt] + '");', true)
		.then(result => {
			var date = new Date();
			var dateString = date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear();
			if (result != dateString || true){
				win2.webContents.executeJavaScript('localStorage.setItem("lastForecastNotification' + locationNames[cycleAt] + '", "' + dateString + '");')
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
				
				// TODO -- Combine periods 0 and 1 for forecast
				if (severeNotification || rainNotification){
					if (rainNotification){
					
					}
				}				
			}
	});
}

// Check the location at for alerts
function alertCheck(urlGet){
	try{
		var request = net.request(urlGet);
		request.on("response", (response) => {
			response.on('data', (chunk) => {
				if (!notifiedAlerts){
					notifiedAlerts = [];
				}
				chunk = JSON.parse(chunk);
				chunk = chunk["features"];
				var at = 0;
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
						console.log(eventType.replace("-watch", ""));
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
							new Notification({ title: chunk[at]["properties"]["event"] + " issued for " + locationNames[cycleAt], body: chunk[at]["properties"]["description"], urgency: "critical", timeoutType: 'never', silent: true, sound: __dirname + "/audio/readynownotification.mp3", icon: __dirname + "/img/warning.png"}).show()
							win2.webContents.executeJavaScript("var audio = new Audio('audio/" + alertSound + "extended.mp3');audio.play();", false);
						}
						else if (notificationSetting == "silentnotification"){
							new Notification({ title: chunk[at]["properties"]["event"] + " issued for " + locationNames[cycleAt], body: chunk[at]["properties"]["description"], urgency: "critical", timeoutType: 'never', silent: true, sound: __dirname + "/audio/readynownotification.mp3", icon: __dirname + "/img/alerts.png"}).show()
						}
						else if (notificationSetting == "soundnotification"){
							if (chunk[at]["properties"]["event"].toLowerCase().includes("watch")){
								new Notification({ title: chunk[at]["properties"]["event"] + " issued for " + locationNames[cycleAt], body: chunk[at]["properties"]["description"], silent: true, icon: __dirname + "/img/watch.png"}).show();
							}
							else{
								new Notification({ title: chunk[at]["properties"]["event"] + " issued for " + locationNames[cycleAt], body: chunk[at]["properties"]["description"], silent: true, icon: __dirname + "/img/alerts.png"}).show();
							}
							win2.webContents.executeJavaScript("var audio = new Audio('audio/" + notificationSound + "notification.mp3');audio.play();", false);
						}
						locationNames[cycleAt]
						console.log(notificationSetting);
						notifiedAlerts.push(chunk[at]["id"]);
					}
					at++;
				}
			})
		})
		request.end();
	}
	catch(err){
		console.log("Computer may be falling asleep.")
	}
}