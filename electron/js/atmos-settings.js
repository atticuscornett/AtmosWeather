/*
	atmos-settings.js
	Handles the setting up and storing of app settings
*/

// Initializes settings and updates settings on update
setTimeout(function(){
	// Get default settings for platform
	let atmosSettingsTemp;
	let thePlatform;
	try{
		thePlatform = getPlatform();
	}
	catch(err){
		thePlatform = "other";
	}
	if (thePlatform.includes("desktop")){
		//document.getElementById("settings-device-location").hidden = true;
		atmosSettingsTemp = {
			"personalization": {"theme": "system", "page-transition-duration": 1500, "atmos-logo": false, "run-startup": true, "update-notify": false},
			"location": {"weather": false, "alerts": false},
			"notifications": {"severe-future": true, "rain-future": false, "quiet-hours": false, "quiet-start": 23, "quiet-end": 6},
			"radar":{"color-scheme":4, "satellite": false, "spc-outlook":true, "polygons":{"watch":true, "advisories":true, "warnings":true, "high-res": false}},
			"location-alerts": {"tts-alerts": false, "alert-check-frequency": "30", "default-alert": "readynow", "default-notification": "readynow", "locations":{}},
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
					"extreme-cold": "soundnotification",
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
					"fire": "alert",
					"shelter-in-place": "alert",
					"civil-danger": "alert",
					"nuclear-power-plant": "alert",
					"radiological-hazard": "alert",
					"hazardous-materials": "alert",
					"law-enforcement": "alert",
					"typhoon": "alert",
					"blowing-dust": "alert",
					"earthquake": "alert",
					"volcano": "alert",
					"ashfall": "alert",
					"high-surf": "soundnotification",
					"extreme-heat": "soundnotification",
					"red-flag": "soundnotification"
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
					"extreme-cold": "soundnotification",
					"winter-storm": "soundnotification",
					"avalanche": "soundnotification",
					"hazardous-seas": "soundnotification",
					"freeze": "soundnotification",
					"hard-freeze": "soundnotification",
					"wind-chill": "soundnotification",
					"tsunami": "alert",
					"hurricane-force-wind": "soundnotification",
					"typhoon": "soundnotification",
					"extreme-heat": "soundnotification",
					"gale": "soundnotification",
					"heavy-freezing-spray": "soundnotification"
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
					"cold-weather": "soundnotification",
					"brisk-wind": "soundnotification",
					"lake-wind": "soundnotification",
					"air-stagnation": "soundnotification",
					"low-water": "soundnotification",
					"blowing-dust": "soundnotification",
					"freezing-spray": "soundnotification",
					"hydrologic-outlook": "soundnotification",
					"flash-flood-statement": "soundnotification",
					"evacuation-immediate": "alert",
					"civil-emergency-message": "alert",
					"ashfall": "soundnotification",
					"flood-statement": "soundnotification",
					"tropical-cyclone-local-statement": "soundnotification",
					"avalanche": "soundnotification",
					"dense-smoke": "soundnotification",
					"local-area-emergency": "alert",
					"extreme-fire-danger": "soundnotification",
					"911-telephone-outage": "alert",
					"coastal-flood-statement": "soundnotification",
					"lakeshore-flood-statement": "soundnotification",
					"air-quality-alert": "soundnotification",
					"short-term-forecast": "soundnotification",
					"administrative-message": "soundnotification",
					"child-abduction-emergency": "soundnotification",
					"blue-alert": "alert"
				}
			},
			"per-location": {}
		};
	}
	else{
		//document.getElementById("settings-startup").hidden = true;
		atmosSettingsTemp = {
		"personalization": {"theme": "system", "page-transition-duration": 1500, "atmos-logo":false, "run-startup": false, "update-notify": true},
		"location": {"weather": true, "alerts": true},
		"notifications": {"severe-future": true, "rain-future": false, "quiet-hours": false, "quiet-start": 23, "quiet-end": 6},
		"location-alerts": {"tts-alerts": false, "alert-check-frequency": "60", "default-alert": "readynow", "default-notification": "readynow", "locations":{}},
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
				"extreme-cold": "soundnotification",
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
				"fire": "alert",
				"shelter-in-place": "alert",
				"civil-danger": "alert",
				"nuclear-power-plant": "alert",
				"radiological-hazard": "alert",
				"hazardous-materials": "alert",
				"law-enforcement": "alert",
				"typhoon": "alert",
				"blowing-dust": "alert",
				"earthquake": "alert",
				"volcano": "alert",
				"ashfall": "alert",
				"high-surf": "soundnotification",
				"extreme-heat": "soundnotification",
				"red-flag": "soundnotification"
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
				"extreme-cold": "soundnotification",
				"winter-storm": "soundnotification",
				"avalanche": "soundnotification",
				"hazardous-seas": "soundnotification",
				"freeze": "soundnotification",
				"hard-freeze": "soundnotification",
				"wind-chill": "soundnotification",
				"tsunami": "alert",
				"hurricane-force-wind": "soundnotification",
				"typhoon": "soundnotification",
				"extreme-heat": "soundnotification",
				"gale": "soundnotification",
				"heavy-freezing-spray": "soundnotification"
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
				"cold-weather": "soundnotification",
				"brisk-wind": "soundnotification",
				"lake-wind": "soundnotification",
				"air-stagnation": "soundnotification",
				"low-water": "soundnotification",
				"blowing-dust": "soundnotification",
				"freezing-spray": "soundnotification",
				"hydrologic-outlook": "soundnotification",
				"flash-flood-statement": "soundnotification",
				"evacuation-immediate": "alert",
				"civil-emergency-message": "alert",
				"ashfall": "soundnotification",
				"flood-statement": "soundnotification",
				"tropical-cyclone-local-statement": "soundnotification",
				"avalanche": "soundnotification",
				"dense-smoke": "soundnotification",
				"local-area-emergency": "alert",
				"extreme-fire-danger": "soundnotification",
				"911-telephone-outage": "alert",
				"coastal-flood-statement": "soundnotification",
				"lakeshore-flood-statement": "soundnotification",
				"air-quality-alert": "soundnotification",
				"short-term-forecast": "soundnotification",
				"administrative-message": "soundnotification",
				"child-abduction-emergency": "soundnotification",
				"blue-alert": "alert"
			}
		},
		"per-location": {}
	};
	}
	let currentSettings = JSON.parse(localStorage.getItem("atmos-settings"));

	// Set missing settings values to the default
	localStorage.setItem("atmos-settings", JSON.stringify(fixMissingKeys(atmosSettingsTemp, currentSettings)));
}, 100);


function checkExistentSettings(){
	for (let i of hazardPriority){
		let hazardLower = i.toLowerCase();
		hazardLower = hazardLower.replaceAll(" ", "-");

		let hazardType = "advisory";
		if (hazardLower.includes("warning")){
			hazardType = "warnings";
			hazardLower = hazardLower.replace("-warning", "");
		}
		else if (hazardLower.includes("watch")){
			hazardType = "watches";
			hazardLower = hazardLower.replace("-watch", "");
		}
		else {
			hazardType = "advisory";
			hazardLower = hazardLower.replace("-advisory", "");
		}

		let settings = JSON.parse(localStorage.getItem("atmos-settings"));
		if (!settings["alert-types"][hazardType][hazardLower]){
			console.log(i + " is missing from settings");
		}
	}
}

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
	if (title.includes("Outlook") || title.includes("Statement") ||
		title.includes("Immediate") || title.includes("Outage") ||
		title.includes("Alert") || title.includes("Danger") ||
		title.includes("Emergency") || title.includes("Forecast") || title.includes("Message")){
		return title;
	}
	else{
		return title + " " + ending;
	}
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
		let keysToCheck = Object.keys(defaultValues);
		let a = 0;
		while (a < keysToCheck.length){
			currentValues[keysToCheck[a]] = fixMissingKeys(defaultValues[keysToCheck[a]], currentValues[keysToCheck[a]]);
			a++;
		}
		return currentValues;
	}
}

// Convert units to preference
function convertTempUnit(temp, unit){
	let userPreference = "F";
	if (userPreference === "F"){
		if (unit === "C"){
			return (temp * 9/5) + 32;
		}
		else{
			return temp;
		}
	}
	else{
		if (unit === "F"){
			return (temp - 32) * 5/9;
		}
		else{
			return temp;
		}
	}
}