/*
	atmos-settings.js
	Handles the setting up and storing of app settings
*/

// Initialize settings
if (!localStorage.getItem("atmos-settings")){
	var atmosSettingsTemp;
	var thePlatform = getPlatform();
	if (thePlatform.includes("desktop")){
		atmosSettingsTemp = {
			"location": {"weather": false, "alerts": false},
			"notifications": {"severe-future": true, "rain-future": false},
			"location-alerts": {"default-alert": "readynow", "default-notification": "readynow", "locations":{}},
			"alert-types": {
				"warnings":{
					"tornado": "alert",
					"hurricane": "alert",
					"hurricane-force-wind": "alert",
					"tropical-storm": "alert",
					"special-marine": "alert",
					"severe-thunderstorm": "alert",
					"storm": "alert",
					"gale": "alert",
					"flash-flood": "alert",
					"flood": "alert",
					"coastal-flood": "alert",
					"river-flood": "alert",
					"high-wind": "soundnotification",
					"extreme-wind": "alert",
					"excessive-heat": "soundnotification",
					"fire-weather": "alert",
					"air-quality": "soundnotification",
					"blizzard": "alert",
					"snow-squall": "alert",
					"ice-storm": "alert",
					"winter-storm": "alert",
					"freeze": "soundnotification",
					"wind-chill": "soundnotification"
				},
				"watches":{
					"tornado": "soundnotification",
					"hurricane": "soundnotification",
					"tropical-storm": "soundnotification",
					"severe-thunderstorm": "soundnotification",
					"flash-flood": "soundnotification",
					"flood": "soundnotification",
					"coastal-flood": "soundnotification",
					"river-flood": "soundnotification",
					"high-wind": "soundnotification",
					"excessive-heat": "soundnotification",
					"fire-weather": "soundnotification",
					"winter-storm": "soundnotification",
					"freeze": "soundnotification"
				},
				"advisory":{
					"wind": "soundnotification",
					"hazardous-weather-outlook": "soundnotification",
					"severe-weather-statement": "soundnotification",
					"special-weather-statement": "soundnotification",
					"winter-weather": "soundnotification",
					"frost": "soundnotification",
					"marine-weather-statement": "soundnotification",
					"rip-current-statement": "soundnotification",
					"beach-hazards-statement": "soundnotification",
					"wind-chill": "soundnotification",
					"heat": "soundnotification",
					"dense-fog": "soundnotification",
					"small-craft": "soundnotification",
					"flood": "soundnotification",
					"coastal-flood": "soundnotification"
				}
			},
			"per-location": {}
		};
	}
	else{
		atmosSettingsTemp = {
		"location": {"weather": true, "alerts": true},
		"notifications": {"severe-future": true, "rain-future": false},
		"location-alerts": {"default-alert": "readynow", "default-notification": "readynow", "locations":{}},
		"alert-types": {
			"warnings":{
				"tornado": "alert",
				"hurricane": "alert",
				"hurricane-force-wind": "alert",
				"tropical-storm": "alert",
				"special-marine": "alert",
				"severe-thunderstorm": "alert",
				"storm": "alert",
				"gale": "alert",
				"flash-flood": "alertmove",
				"flood": "alertmove",
				"coastal-flood": "alertmove",
				"river-flood": "alertmove",
				"high-wind": "soundnotification",
				"extreme-wind": "alert",
				"excessive-heat": "soundnotification",
				"fire-weather": "alert",
				"air-quality": "soundnotification",
				"blizzard": "alert",
				"snow-squall": "alertmove",
				"ice-storm": "alert",
				"winter-storm": "alert",
				"freeze": "soundnotification",
				"wind-chill": "soundnotification"
			},
			"watches":{
				"tornado": "soundnotification",
				"hurricane": "soundnotification",
				"tropical-storm": "soundnotification",
				"severe-thunderstorm": "soundnotification",
				"flash-flood": "soundnotification",
				"flood": "soundnotification",
				"coastal-flood": "soundnotification",
				"river-flood": "soundnotification",
				"high-wind": "soundnotification",
				"excessive-heat": "soundnotification",
				"fire-weather": "soundnotification",
				"winter-storm": "soundnotification",
				"freeze": "soundnotification"
			},
			"advisory":{
				"wind": "soundnotification",
				"hazardous-weather-outlook": "soundnotification",
				"severe-weather-statement": "soundnotification",
				"special-weather-statement": "soundnotification",
				"marine-weather-statement": "soundnotification",
				"rip-current-statement": "soundnotification",
				"beach-hazards-statement": "soundnotification",
				"winter-weather": "soundnotification",
				"frost": "soundnotification",
				"wind-chill": "soundnotification",
				"heat": "soundnotification",
				"dense-fog": "soundnotification",
				"small-craft": "soundnotification",
				"flood": "soundnotification",
				"coastal-flood": "soundnotification"
			}
		},
		"per-location": {}
	};
	}
	localStorage.setItem("atmos-settings", JSON.stringify(atmosSettingsTemp))
}

// Refresh settings tab
function refreshSettings(){
	var allSettings = JSON.parse(localStorage.getItem("atmos-settings"));
	
	// Location Settings
	document.getElementById("setting-current-location").checked = allSettings["location"]["weather"];
	document.getElementById("setting-current-location-alerts").checked = allSettings["location"]["alerts"];
	
	// Notification Settings
	document.getElementById("setting-future-severe-notifications").checked = allSettings["notifications"]["severe-future"];
	document.getElementById("setting-future-storm-notifications").checked = allSettings["notifications"]["rain-future"];
	
	// Alert Sound Settings
	document.getElementById("setting-default-sound-alert").value = allSettings["location-alerts"]["default-alert"];
	document.getElementById("setting-default-sound-notification").value = allSettings["location-alerts"]["default-notification"];
	
	var a = 0;
	
	// Load Warning Settings
	var warningTypes = Object.keys(allSettings["alert-types"]["warnings"]);
	while (a < warningTypes.length){
		document.getElementById("setting-" + warningTypes[a] + "-warning").value = allSettings["alert-types"]["warnings"][warningTypes[a]];
		a++;
	}
	
	// Load Watch Settings
	var watchTypes = Object.keys(allSettings["alert-types"]["watches"])
	a = 0;
	while (a < watchTypes.length){
		document.getElementById("setting-" + watchTypes[a] + "-watch").value = allSettings["alert-types"]["watches"][watchTypes[a]]
		a++;
	}
	
	// Load Advisory Settings
	var advisoryTypes = Object.keys(allSettings["alert-types"]["advisory"])
	a = 0;
	while (a < advisoryTypes.length){
		document.getElementById("setting-" + advisoryTypes[a] + "-advisory").value = allSettings["alert-types"]["advisory"][advisoryTypes[a]];
		a++;
	}
	
	// Load Location Specific Settings
	var allLocations = JSON.parse(localStorage.getItem("weather-locations"));
	var locationNames = nomItemsToNames(allLocations);
	a = 0;
	document.getElementById("location-settings-div").innerHTML = "";
	while (a < allLocations.length){
		document.getElementById("location-settings-div").innerHTML += "<h2><a href='#' onclick='loadLocationSettings(" + a.toString() + ")'>" + locationNames[a] + " Alert Settings</a></h2>";
		a++;
	}
	
}

// Save settings
function saveSettings(){
	var allSettings = JSON.parse(localStorage.getItem("atmos-settings"));
	allSettings["location"]["weather"] = document.getElementById("setting-current-location").checked;
	allSettings["location"]["alerts"] = document.getElementById("setting-current-location-alerts").checked;
	
	allSettings["notifications"]["severe-future"] = document.getElementById("setting-future-severe-notifications").checked;
	allSettings["notifications"]["rain-future"] = document.getElementById("setting-future-storm-notifications").checked;
	
	allSettings["location-alerts"]["default-alert"] = document.getElementById("setting-default-sound-alert").value;
	allSettings["location-alerts"]["default-notification"] = document.getElementById("setting-default-sound-notification").value;
	
	var a = 0;
	
	// Save Warning Settings
	var warningTypes = Object.keys(allSettings["alert-types"]["warnings"]);
	while (a < warningTypes.length){
		allSettings["alert-types"]["warnings"][warningTypes[a]] = document.getElementById("setting-" + warningTypes[a] + "-warning").value;
		a++;
	}
	
	// Load Watch Settings
	var watchTypes = Object.keys(allSettings["alert-types"]["watches"])
	a = 0;
	while (a < watchTypes.length){
		allSettings["alert-types"]["watches"][watchTypes[a]] = document.getElementById("setting-" + watchTypes[a] + "-watch").value;
		a++;
	}
	
	// Load Advisory Settings
	var advisoryTypes = Object.keys(allSettings["alert-types"]["advisory"])
	a = 0;
	while (a < advisoryTypes.length){
		allSettings["alert-types"]["advisory"][advisoryTypes[a]] =document.getElementById("setting-" + advisoryTypes[a] + "-advisory").value;
		a++;
	}
	localStorage.setItem("atmos-settings", JSON.stringify(allSettings))
	syncFiles()
}

// Keep saving settings until page is left
function keepSaving(){
	if (screenAt == "settings"){
		saveSettings();
		setTimeout(keepSaving, 250);
	}
}

// Load the location settings page
function loadLocationSettings(index){
	window.settingsIndex = index;
	var locations = JSON.parse(localStorage.getItem("weather-locations"));
	var names = nomItemsToNames(locations);
	document.getElementById("single-location-settings-title").innerHTML = "Alert Settings for " + names[index];
	var names = nomItemsToNames(locations);
	var allSettings = JSON.parse(localStorage.getItem("atmos-settings"));
	if (!allSettings["per-location"].hasOwnProperty(names[window.settingsIndex])){
		console.log("Making blank")
		allSettings["per-location"][names[window.settingsIndex]] = {"notifications":{}, "location-alerts":{}, "alert-types":{"warnings":{}, "watches":{}, "advisory":{}}};
	}
	var theName = names[window.settingsIndex];
	// Check if location has non-default setting, otherwise show default
	if (allSettings["per-location"][theName]["notifications"].hasOwnProperty("severe-future")){
		document.getElementById("setting-future-severe-notifications-location").checked = allSettings["per-location"][theName]["notifications"]["severe-future"];
	}
	else{
		document.getElementById("setting-future-severe-notifications-location").checked = allSettings["notifications"]["severe-future"];
	}
	if (allSettings["per-location"][theName]["notifications"].hasOwnProperty("rain-future")){
		document.getElementById("setting-future-storm-notifications-location").checked = allSettings["per-location"][theName]["notifications"]["rain-future"];
	}
	else{
		document.getElementById("setting-future-storm-notifications-location").checked = allSettings["notifications"]["rain-future"];
	}
	if (allSettings["per-location"][theName]["location-alerts"].hasOwnProperty("default-alert")){
		document.getElementById("setting-default-sound-alert-location").value = allSettings["per-location"][theName]["location-alerts"]["default-alert"]	
	}
	else{
		document.getElementById("setting-default-sound-alert-location").value = allSettings["location-alerts"]["default-alert"]
	}
	if (allSettings["per-location"][theName]["location-alerts"].hasOwnProperty("default-notification")){
		document.getElementById("setting-default-sound-notification-location").value = allSettings["per-location"][theName]["location-alerts"]["default-notification"]	
	}
	else{
		document.getElementById("setting-default-sound-notification-location").value = allSettings["location-alerts"]["default-notification"]
	}
	var a = 0;
	var warningTypes = Object.keys(allSettings["alert-types"]["warnings"]);
	while (a < warningTypes.length){
		if (allSettings["per-location"][theName]["alert-types"]["warnings"].hasOwnProperty(warningTypes[a])){
			document.getElementById("setting-" + warningTypes[a] + "-warning-location").value = allSettings["per-location"][theName]["alert-types"]["warnings"][warningTypes[a]];
		}
		else{
			document.getElementById("setting-" + warningTypes[a] + "-warning-location").value = allSettings["alert-types"]["warnings"][warningTypes[a]];
		}
		
		a++;
	}
	a = 0;
	var watchTypes = Object.keys(allSettings["alert-types"]["watches"]);
	while (a < watchTypes.length){
		if (allSettings["per-location"][theName]["alert-types"]["watches"].hasOwnProperty(watchTypes[a])){
			document.getElementById("setting-" + watchTypes[a] + "-watch-location").value = allSettings["per-location"][theName]["alert-types"]["watches"][watchTypes[a]];
		}
		else{
			document.getElementById("setting-" + watchTypes[a] + "-watch-location").value = allSettings["alert-types"]["watches"][watchTypes[a]];
		}
		
		a++;
	}
	a = 0;
	var advisoryTypes = Object.keys(allSettings["alert-types"]["advisory"]);
	while (a < advisoryTypes.length){
		if (allSettings["per-location"][theName]["alert-types"]["advisory"].hasOwnProperty(advisoryTypes[a])){
			document.getElementById("setting-" + advisoryTypes[a] + "-advisory-location").value = allSettings["per-location"][theName]["alert-types"]["advisory"][advisoryTypes[a]];
		}
		else{
			document.getElementById("setting-" + advisoryTypes[a] + "-advisory-location").value = allSettings["alert-types"]["advisory"][advisoryTypes[a]];
		}
		
		a++;
	}
	localStorage.setItem("atmos-settings", JSON.stringify(allSettings));
	setTimeout(keepSavingForLocation, 1000);
	navTo("single-location-settings");
}

function saveLocationSettings(){
	var allSettings = JSON.parse(localStorage.getItem("atmos-settings"));
	var name = nomItemsToNames(JSON.parse(localStorage.getItem("weather-locations")))[window.settingsIndex];
	// Check if setting for location not equal default, if not default, change and save, if default, delete key
	if (document.getElementById("setting-future-severe-notifications-location").checked != allSettings["notifications"]["severe-future"]){
		allSettings["per-location"][name]["notifications"]["severe-future"] = document.getElementById("setting-future-severe-notifications-location").checked;
	}
	else{
		delete allSettings["per-location"][name]["notifications"]["severe-future"];
	}
	if (document.getElementById("setting-future-storm-notifications-location").checked != allSettings["notifications"]["rain-future"]){
		allSettings["per-location"][name]["notifications"]["rain-future"] = document.getElementById("setting-future-storm-notifications-location").checked;
	}
	else{
		console.log("delete")
		delete allSettings["per-location"][name]["notifications"]["rain-future"]
	}
	if (document.getElementById("setting-default-sound-alert-location").value != allSettings["location-alerts"]["default-alert"]){
		allSettings["per-location"][name]["location-alerts"]["default-alert"] = document.getElementById("setting-default-sound-alert-location").value;
	}
	else{
		delete allSettings["per-location"][name]["location-alerts"]["default-alert"];
	}
	if (document.getElementById("setting-default-sound-notification-location").value != allSettings["location-alerts"]["default-notification"]){
		allSettings["per-location"][name]["location-alerts"]["default-notification"] = document.getElementById("setting-default-sound-notification-location").value;
	}
	else{
		delete allSettings["per-location"][name]["location-alerts"]["default-notification"];
	}
	var a = 0;
	var warningTypes = Object.keys(allSettings["alert-types"]["warnings"]);
	while (a < warningTypes.length){
		if (document.getElementById("setting-" + warningTypes[a] + "-warning-location").value != allSettings["alert-types"]["warnings"][warningTypes[a]]){
			 allSettings["per-location"][name]["alert-types"]["warnings"][warningTypes[a]] = document.getElementById("setting-" + warningTypes[a] + "-warning-location").value;
		}
		else{
			delete allSettings["per-location"][name]["alert-types"]["warnings"][warningTypes[a]];
		}
		a++;
	}
	a = 0;
	var watchTypes = Object.keys(allSettings["alert-types"]["watches"]);
	while (a < watchTypes.length){
		if (document.getElementById("setting-" + watchTypes[a] + "-watch-location").value != allSettings["alert-types"]["watches"][watchTypes[a]]){
			 allSettings["per-location"][name]["alert-types"]["watches"][watchTypes[a]] = document.getElementById("setting-" + watchTypes[a] + "-watch-location").value;
		}
		else{
			delete allSettings["per-location"][name]["alert-types"]["watches"][watchTypes[a]]
		}
		a++;
	}
	a = 0;
	var advisoryTypes = Object.keys(allSettings["alert-types"]["advisory"]);
	while (a < advisoryTypes.length){
		if (document.getElementById("setting-" + advisoryTypes[a] + "-advisory-location").value != allSettings["alert-types"]["advisory"][advisoryTypes[a]]){
			 allSettings["per-location"][name]["alert-types"]["advisory"][advisoryTypes[a]] = document.getElementById("setting-" + advisoryTypes[a] + "-advisory-location").value;
		}
		else{
			delete allSettings["per-location"][name]["alert-types"]["advisory"][advisoryTypes[a]]
		}
		a++;
	}
	localStorage.setItem("atmos-settings", JSON.stringify(allSettings));
	syncFiles();
}

function keepSavingForLocation(){
	if (screenAt == "single-location-settings"){
		saveLocationSettings()
		setTimeout(keepSavingForLocation, 250);
	}
}