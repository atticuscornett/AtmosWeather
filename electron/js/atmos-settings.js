/*
	atmos-settings.js
	Handles the setting up and storing of app settings
*/

// Initializes settings and updates settings on new version
setTimeout(function(){
	// Get default settings for platform
	var atmosSettingsTemp;
	try{
		var thePlatform = getPlatform();
	}
	catch(err){
		thePlatform = "other";
	}
	if (thePlatform.includes("desktop")){
		atmosSettingsTemp = {
			"personalization": {"theme": "system"},
			"location": {"weather": false, "alerts": false},
			"notifications": {"severe-future": true, "rain-future": false},
			"radar":{"color-scheme":4, "satellite": false, "spc-outlook":true, "polygons":{"watch":true, "advisories":true, "warnings":true, "high-res": false}},
			"location-alerts": {"tts-alerts": false, "default-alert": "readynow", "default-notification": "readynow", "locations":{}},
			"alert-types": {
				"warnings":{
					"tornado": "alert",
					"hurricane": "alert",
					"storm-surge": "alert",
					"hurricane-force-wind": "alert",
					"tropical-storm": "alert",
					"tsunami": "alert",
					"special-marine": "alert",
					"severe-thunderstorm": "alert",
					"storm": "alert",
					"gale": "alert",
					"flash-flood": "alert",
					"flood": "alert",
					"coastal-flood": "alert",
					"river-flood": "alert",
					"lakeshore-flood": "alert",
					"high-wind": "soundnotification",
					"extreme-wind": "alert",
					"excessive-heat": "soundnotification",
					"fire-weather": "alert",
					"air-quality": "soundnotification",
					"blizzard": "alert",
					"snow-squall": "alert",
					"ice-storm": "alert",
					"winter-storm": "alert",
					"lake-effect-snow": "alert",
					"avalanche": "alert",
					"hard-freeze": "soundnotification",
					"freeze": "soundnotification",
					"wind-chill": "soundnotification",
					"dust-storm": "alert",
					"hazardous-seas": "soundnotification",
					"heavy-freezing-spray": "soundnotification",
					"fire": "alert"
				},
				"watches":{
					"tornado": "soundnotification",
					"hurricane": "soundnotification",
					"storm-surge": "soundnotification",
					"tropical-storm": "soundnotification",
					"severe-thunderstorm": "soundnotification",
					"storm": "soundnotification",
					"flash-flood": "soundnotification",
					"flood": "soundnotification",
					"coastal-flood": "soundnotification",
					"river-flood": "soundnotification",
					"lakeshore-flood": "soundnotification",
					"high-wind": "soundnotification",
					"excessive-heat": "soundnotification",
					"fire-weather": "soundnotification",
					"winter-storm": "soundnotification",
					"avalanche": "soundnotification",
					"hazardous-seas": "soundnotification",
					"freeze": "soundnotification",
					"hard-freeze": "soundnotification",
					"wind-chill": "soundnotification"
				},
				"advisory":{
					"wind": "soundnotification",
					"dust": "soundnotification",
					"hazardous-weather-outlook": "soundnotification",
					"severe-weather-statement": "soundnotification",
					"hurricane-local-statement": "alert",
					"tsunami": "alert",
					"tropical-cyclone-statement": "soundnotification",
					"special-weather-statement": "soundnotification",
					"winter-weather": "soundnotification",
					"frost": "soundnotification",
					"marine-weather-statement": "soundnotification",
					"rip-current-statement": "soundnotification",
					"beach-hazards-statement": "soundnotification",
					"wind-chill": "soundnotification",
					"heat": "soundnotification",
					"dense-fog": "soundnotification",
					"freezing-fog": "soundnotification",
					"small-craft": "soundnotification",
					"flood": "soundnotification",
					"coastal-flood": "soundnotification",
					"lakeshore-flood": "soundnotification",
					"high-surf": "soundnotification",
					"brisk-wind": "soundnotification",
					"lake-wind": "soundnotification",
					"air-stagnation": "soundnotification",
					"low-water": "soundnotification",
					"blowing-dust": "soundnotification",
					"freezing-spray": "soundnotification",
					"hydrologic-outlook": "soundnotification"
				}
			},
			"per-location": {}
		};
	}
	else{
		atmosSettingsTemp = {
			"personalization": {"theme": "system"},
		"location": {"weather": true, "alerts": true},
		"notifications": {"severe-future": true, "rain-future": false},
		"location-alerts": {"tts-alerts": false, "default-alert": "readynow", "default-notification": "readynow", "locations":{}},
		"radar":{"color-scheme":4, "satellite": false, "spc-outlook":true, "polygons":{"watch":true, "advisories":true, "warnings":true, "high-res":false}},
		"alert-types": {
			"warnings":{
				"tornado": "alert",
				"hurricane": "alert",
				"storm-surge": "alert",
				"hurricane-force-wind": "alert",
				"tropical-storm": "alert",
				"tsunami": "alert",
				"special-marine": "alert",
				"severe-thunderstorm": "alert",
				"storm": "alert",
				"gale": "alert",
				"flash-flood": "alertmove",
				"flood": "alertmove",
				"coastal-flood": "alertmove",
				"river-flood": "alertmove",
				"lakeshore-flood": "alertmove",
				"high-wind": "soundnotification",
				"extreme-wind": "alert",
				"excessive-heat": "soundnotification",
				"fire-weather": "alert",
				"air-quality": "soundnotification",
				"blizzard": "alert",
				"snow-squall": "alertmove",
				"ice-storm": "alert",
				"winter-storm": "alert",
				"lake-effect-snow": "alert",
				"avalanche": "alert",
				"hard-freeze": "soundnotification",
				"freeze": "soundnotification",
				"wind-chill": "soundnotification",
				"dust-storm": "alert",
				"hazardous-seas": "soundnotification",
				"heavy-freezing-spray": "soundnotification",
				"fire": "alert"
			},
			"watches":{
				"tornado": "soundnotification",
				"hurricane": "soundnotification",
				"storm-surge": "soundnotification",
				"tropical-storm": "soundnotification",
				"severe-thunderstorm": "soundnotification",
				"storm": "soundnotification",
				"flash-flood": "soundnotification",
				"flood": "soundnotification",
				"coastal-flood": "soundnotification",
				"river-flood": "soundnotification",
				"lakeshore-flood": "soundnotification",
				"high-wind": "soundnotification",
				"excessive-heat": "soundnotification",
				"fire-weather": "soundnotification",
				"winter-storm": "soundnotification",
				"avalanche": "soundnotification",
				"hazardous-seas": "soundnotification",
				"freeze": "soundnotification",
				"hard-freeze": "soundnotification",
				"wind-chill": "soundnotification"
			},
			"advisory":{
				"wind": "soundnotification",
				"dust": "soundnotification",
				"hazardous-weather-outlook": "soundnotification",
				"severe-weather-statement": "soundnotification",
				"hurricane-local-statement": "alert",
				"tsunami": "alert",
				"tropical-cyclone-statement": "soundnotification",
				"special-weather-statement": "soundnotification",
				"marine-weather-statement": "soundnotification",
				"rip-current-statement": "soundnotification",
				"beach-hazards-statement": "soundnotification",
				"winter-weather": "soundnotification",
				"frost": "soundnotification",
				"wind-chill": "soundnotification",
				"heat": "soundnotification",
				"dense-fog": "soundnotification",
				"freezing-fog": "soundnotification",
				"small-craft": "soundnotification",
				"flood": "soundnotification",
				"coastal-flood": "soundnotification",
				"lakeshore-flood": "soundnotification",
				"high-surf": "soundnotification",
				"brisk-wind": "soundnotification",
				"lake-wind": "soundnotification",
				"air-stagnation": "soundnotification",
				"low-water": "soundnotification",
				"blowing-dust": "soundnotification",
				"freezing-spray": "soundnotification",
				"hydrologic-outlook": "soundnotification"
			}
		},
		"per-location": {}
	};
	}
	var currentSettings = JSON.parse(localStorage.getItem("atmos-settings"));

	// Set missing settings values to the default
	localStorage.setItem("atmos-settings", JSON.stringify(fixMissingKeys(atmosSettingsTemp, currentSettings)));
}, 100);

// Initialize Locations
if (!localStorage.getItem("weather-locations")){
	localStorage.setItem("weather-locations", "[]");
	localStorage.setItem("weather-location-names", "[]")
}

function formatTitle(title, ending){
	title = title.split("-");
	for (let i in title){
		title[i] = title[i][0].toUpperCase() + title[i].substring(1)
	}
	title = title.join(" ");
	if (title.includes("Outlook") || title.includes("Statement")){
		return title;
	}
	else{
		return title + " " + ending;
	}
}

// Add settings options to the settings page
function populateSettingsPage(locationMode){
	let modifier = locationMode ? "-location" : "";
	let types = ["Warning", "Watch", "Advisory"]
	let types2 = ["warnings", "watches", "advisory"]
	try{
		var thePlatform = getPlatform();
	}
	catch(err){
		thePlatform = "other";
	}
	var allSettings = JSON.parse(localStorage.getItem("atmos-settings"));
	for (type in types){
		document.getElementById("settings-" + types2[type] + "-list" + modifier).innerHTML = "";
		let docFragment = document.createDocumentFragment();
		for (let i in allSettings["alert-types"][types2[type]]){
			let line = document.createElement("label");
			line.innerText = formatTitle(i, types[type]);
			line.setAttribute("for", "setting-" + i + "-" + types[type].toLowerCase() + modifier);
			docFragment.appendChild(line);
			docFragment.appendChild(document.createElement("br"));
			let select = document.createElement("select");
			select.setAttribute("id", "setting-" + i + "-" + types[type].toLowerCase() + modifier);
			let option = document.createElement("option");
			option.innerHTML = "Alert";
			option.setAttribute("value", "alert");
			select.appendChild(option);
			if (!thePlatform.includes("desktop")){
				option = document.createElement("option");
				option.innerHTML = "Alert if moving";
				option.setAttribute("value", "alertmove");
				select.appendChild(option);
			}
			option = document.createElement("option");
			option.innerHTML = "Sound Notification";
			option.setAttribute("value", "soundnotification");
			select.appendChild(option);
			option = document.createElement("option");
			option.innerHTML = "Silent Notification";
			option.setAttribute("value", "silentnotification");
			select.appendChild(option);
			option = document.createElement("option");
			option.innerHTML = "Nothing";
			option.setAttribute("value", "nothing");
			select.appendChild(option);
			docFragment.appendChild(select);
			docFragment.appendChild(document.createElement("br"));
		}
		document.getElementById("settings-" + types2[type] + "-list" + modifier).appendChild(docFragment);
	}
	
}

// Refresh settings tab
function refreshSettings(){
	populateSettingsPage(false);
	var allSettings = JSON.parse(localStorage.getItem("atmos-settings"));

	// Personalization Settings
	document.getElementById("setting-app-theme").value = allSettings["personalization"]["theme"];
	
	// Location Settings
	document.getElementById("setting-current-location").checked = allSettings["location"]["weather"];
	document.getElementById("setting-current-location-alerts").checked = allSettings["location"]["alerts"];
	
	// Notification Settings
	document.getElementById("setting-future-severe-notifications").checked = allSettings["notifications"]["severe-future"];
	document.getElementById("setting-future-storm-notifications").checked = allSettings["notifications"]["rain-future"];

	// Radar Settings
	document.getElementById("setting-radar-color-scheme").value = allSettings["radar"]["color-scheme"];
	document.getElementById("setting-radar-satellite").checked = allSettings["radar"]["satellite"];
	document.getElementById("setting-radar-show-outlook").checked = allSettings["radar"]["spc-outlook"];
	document.getElementById("setting-radar-show-watches").checked = allSettings["radar"]["polygons"]["watch"];
	document.getElementById("setting-radar-show-advisories").checked = allSettings["radar"]["polygons"]["advisories"];
	document.getElementById("setting-radar-show-warnings").checked = allSettings["radar"]["polygons"]["warnings"];
	document.getElementById("setting-radar-high-res").checked = allSettings["radar"]["polygons"]["high-res"];
	
	// Alert Sound Settings
	document.getElementById("setting-tts-alerts").checked = allSettings["location-alerts"]["tts-alerts"];
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

	allSettings["personalization"]["theme"] = document.getElementById("setting-app-theme").value;

	allSettings["location"]["weather"] = document.getElementById("setting-current-location").checked;
	allSettings["location"]["alerts"] = document.getElementById("setting-current-location-alerts").checked;
	
	allSettings["notifications"]["severe-future"] = document.getElementById("setting-future-severe-notifications").checked;
	allSettings["notifications"]["rain-future"] = document.getElementById("setting-future-storm-notifications").checked;

	allSettings["radar"]["color-scheme"] = Number(document.getElementById("setting-radar-color-scheme").value);
	allSettings["radar"]["satellite"] = document.getElementById("setting-radar-satellite").checked;
	allSettings["radar"]["spc-outlook"] = document.getElementById("setting-radar-show-outlook").checked;
	allSettings["radar"]["polygons"]["watch"] = document.getElementById("setting-radar-show-watches").checked;
	allSettings["radar"]["polygons"]["advisories"] = document.getElementById("setting-radar-show-advisories").checked;
	allSettings["radar"]["polygons"]["warnings"] = document.getElementById("setting-radar-show-warnings").checked;
	allSettings["radar"]["polygons"]["high-res"] = document.getElementById("setting-radar-high-res").checked;
	
	allSettings["location-alerts"]["tts-alerts"] = document.getElementById("setting-tts-alerts").checked;
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
	refreshAppTheme();
	syncFiles();
}

// Load the location settings page
function loadLocationSettings(index){
	populateSettingsPage(true);
	window.settingsIndex = index;
	var locations = JSON.parse(localStorage.getItem("weather-locations"));
	var names = nomItemsToNames(locations);
	document.getElementById("single-location-settings-title").innerHTML = "Alert Settings for " + names[index];
	var names = nomItemsToNames(locations);
	var allSettings = JSON.parse(localStorage.getItem("atmos-settings"));
	if (!allSettings["per-location"].hasOwnProperty(names[window.settingsIndex])){
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
	if (allSettings["per-location"][theName]["location-alerts"].hasOwnProperty("tts-alerts")){
		document.getElementById("setting-tts-alerts-location").checked = allSettings["per-location"][theName]["location-alerts"]["tts-alerts"]	
	}
	else{
		document.getElementById("setting-tts-alerts-location").checked = allSettings["location-alerts"]["tts-alerts"]
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
		delete allSettings["per-location"][name]["notifications"]["rain-future"]
	}
	if (document.getElementById("setting-tts-alerts-location").checked != allSettings["location-alerts"]["tts-alerts"]){
		allSettings["per-location"][name]["location-alerts"]["tts-alerts"] = document.getElementById("setting-tts-alerts-location").checked;
	}
	else{
		delete allSettings["per-location"][name]["location-alerts"]["tts-alerts"];
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

// Find any keys that are present in the default that are missing in the current object and set to the default values (without changing present keys)
function fixMissingKeys(defaultValues, currentValues){
	if (currentValues == undefined){
		return defaultValues;
	}
	if (currentValues.constructor != Object || defaultValues.constructor != Object){
		return currentValues;
	}
	else{
		var keysToCheck = Object.keys(defaultValues);
		var a = 0;
		while (a < keysToCheck.length){
			currentValues[keysToCheck[a]] = fixMissingKeys(defaultValues[keysToCheck[a]], currentValues[keysToCheck[a]]);
			a++;
		}
		return currentValues;
	}
}