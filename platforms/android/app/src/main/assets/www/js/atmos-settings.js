/*
	atmos-settings.js
	Handles the setting up and storing of app settings
*/

// Initialize settings
if (!localStorage.getItem("atmos-settings")){
	var atmosSettingsTemp = {
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
				"winter-weather": "soundnotification",
				"frost": "soundnotification",
				"wind-chill": "soundnotification",
				"heat": "soundnotification",
				"dense-fog": "soundnotification",
				"small-craft": "soundnotification",
				"coastal-flood": "soundnotification"
			}
		}
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
		setTimeout(saveSettings, 1000);
	}
}