/*
	atmos-ui.js
	Handles most user interface related Javascript
	Also functions as a miscellaneous function file
*/

// Initialize Cordova
document.addEventListener('deviceready', function(){console.log(cordova.platformId);cordovaReady=true;}, false);

// Initial Variable States
var screenAt = "locations";
var cordovaReady = false;
var currentLat = false;
var currentLong = false;
var locationEnabled = true;
var lastLocationCheck = 0;
var lastLocationInfo;

// Hides the notice screen on button press
function hideNotices(){
	document.getElementById("notice-window-container").hidden = true;
}

// Initialize Leaflet Maps
var map = L.map('alert-map').setView([33.543682, -86.8104], 13);
var map2 = L.map('radar-map').setView([40.58207622, -95.461760283], 3);
map.on("load", function(){console.log("map loaded")})
var polygon = false;
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    	maxZoom: 19,
    	attribution: '© OpenStreetMap'
	}).addTo(map);
// Decides if there are any notices to show, and if so, creates them and shows them
function showNotices(){
	if (!localStorage.getItem("run-before") && getPlatform() != "pwa"){
		document.getElementById("welcome-window-native").hidden = false;
		document.getElementById("atmos-logo").style = "animation: fadeOut 2s; animation-fill-mode: forwards;"
		return;
	}
	if (!cordovaReady){
		setTimeout(showNotices, 1000);
		return;
	}
	document.getElementById("atmos-logo").style = "animation: fadeOut 2s; animation-fill-mode: forwards;"
	// Check if running the web browser version
	/* NOTE: Unlike other messages that do not show again after they are read,
	this message will continue to pop up every time the website is accessed */
	var platform = "unknown"
	if (cordova.platformId == "browser"){
		// Running either electron version or online version
		if (window && window.process && window.process.type){
			console.log("Atmos Electron Version")
			platform = "desktop";
		}
		else{
			console.log("Atmos Web Version")
			document.getElementById("notice-window").innerHTML += `
				<h2>You are using the Atmos Weather web client.</h2>
				<hr>
				<h3>Some features are limited or not available in the web client. Weather alerts can only be given while the website is open. Your saved locations are deleted whenever you clear your browser history. Forecast notifications are not available, and your location will not be updated in the background. To get weather alerts and have the best user experience, we recommend downloading our Windows or Android apps.</h3>
				<br><br>
			`
			document.getElementById("notice-window-container").hidden = false;
			platform = "pwa";
		}
	}
	else{
		if (cordova.platformId == "electron"){
			if (navigator.platform.indexOf("Win") == 0){
				console.log("Atmos for Windows")
				platform = "desktop-windows"
			}
			else if (navigator.platform.indexOf("Mac") == 0){
				console.log("Atmos for Mac")
				platform = "desktop-mac"
			}
			else{
				console.log("Atmos for Linux/Other")
				platform = "desktop-linux"
			}
		}
		else{
			console.log("Atmos Mobile Version")
			platform = cordova.platformId;
		}
	}
	
	// Important Notice About Weather Alerts
	if (!window.localStorage.getItem("notice-weatherAlerts")){
		document.getElementById("notice-window").innerHTML += `
		<h2>Important Information About Weather Warnings</h2>
		<hr>
		<h3>Although we strive to give rapid, accurate warning notifications 24/7, Atmos Weather should not be your only method of recieving emergency alerts. If internet service is lost or other errors occur, Atmos cannot give you alerts. All homes should have at least one weather radio with a battery backup so that they can receive weather information even when the power is out. Atmos Weather is not responsible for alerts not sending or the consequences of alerts not sending.</h3>
		<br><br>
		`
		document.getElementById("notice-window-container").hidden = false;
		window.localStorage.setItem("notice-weatherAlerts", "true");
	}
	// UPDATE
	if (!window.localStorage.getItem("notice-version0.8.0")){
		document.getElementById("notice-window").innerHTML += `
		<h2>Atmos Weather v0.8.0 is here!</h2>
		<hr>
		 <dl style='font-family: Secular One;'>
			<dt>New Features</dt>
  			<dd>- Welcome Screen Added On First Launch</dd>
			<dd>- Radar Screen Added</dd>
			<dt>Bug Fixes Everywhere</dt>
  			<dd>- Fixed bug with notification settings on Electron version</dd>
			<dd>- Fixed Android version not updating properly.</dd>
		</dl> 
		<br><br>
		`
		document.getElementById("notice-window-container").hidden = false;
		window.localStorage.setItem("notice-version0.7.0", "true");
	}
	
	// Congressional App Challenge Outdated Version Warning
	document.getElementById("notice-window").innerHTML += `
	<h2>You are running the Congressional App Challenge version of Atmos Weather.</h2>
	<hr>
	<h3>Atmos Weather was originally created as an app for the Congressional App Challenge. However, the app has been updated since then. This is the version of Atmos that was current as of submission to the Congressional App Challenge, and is available as a snapshot to show the features that were created before submission. If you intended to use this outdated version of Atmos, you can ignore this message.</h3>
	<br><br>
	`
	document.getElementById("notice-window-container").hidden = false;
	console.log(platform);
	if (platform == "pwa"){
		document.getElementById("settings-warning").hidden = false;
	}
}

// Check the version of Atmos being run
function getPlatform(){
	var platform = "unknown"
	if (cordova.platformId == "browser"){
		// Running either electron version or online version
		if (window && window.process && window.process.type){
			console.log("Atmos Electron Version")
			platform = "desktop";
		}
		else{
			console.log("Atmos Web Version")
			platform = "pwa";
		}
	}
	else{
		if (cordova.platformId == "electron"){
			if (navigator.platform.indexOf("Win") == 0){
				console.log("Atmos for Windows")
				platform = "desktop-windows"
			}
			else if (navigator.platform.indexOf("Mac") == 0){
				console.log("Atmos for Mac")
				platform = "desktop-mac"
			}
			else{
				console.log("Atmos for Linux/Other")
				platform = "desktop-linux"
			}
		}
		else{
			console.log("Atmos Mobile Version")
			platform = device.platform;
		}
	}
	window.platform = platform;
	return platform;
}

// Initialize Buttons for index.html
function activateNavButtons(){
	document.getElementById("location-nav").onclick = function (){
		if (screenAt != "locations"){
			navTo("locations");
		}
	};
	document.getElementById("alerts-nav").onclick = function (){
		if (screenAt != "alerts"){
			navTo("alerts");
		}
	};
	document.getElementById("radar-nav").onclick = function (){
		if (screenAt != "radar"){
			navTo("radar");
		}
	};
	document.getElementById("settings-nav").onclick = function (){
		if (screenAt != "settings"){
			navTo("settings");
		}
	};
}

// Navigate to another screen
function navTo(screenTo){
	document.getElementById("tab-" + screenAt).setAttribute("style", "animation: offLeft 2s;")
	setTimeout(function(){
		document.getElementById("tab-" + screenAt).setAttribute("style", "")
		document.getElementById("tab-" + screenAt).hidden = true;
		navCode(screenTo);
		document.getElementById("tab-" + screenTo).setAttribute("style", "animation: onRight 2s;");
		document.getElementById("tab-" + screenTo).hidden = false;
		screenAt = screenTo;
	}, 500);
}

// Checks if the NWS weather API is available
const checkAPIstatus = async () => {
  try {
    const online = await fetch("https://api.weather.gov");
    return online.status >= 200 && online.status < 300;
  } catch (err) {
    return false;
  }
};

// Runs Nominatim search and shows results on add location tab
function locationSearch(){
	document.getElementById("search-results").innerHTML = "";
	var theSearch = document.getElementById("location-search").value;
	var searchOutput = nomSearch(theSearch);
	var searchResults = nomItemsToNames(searchOutput);
	var noRep = [];
	console.log(searchResults);
	var a = 0;
	while (a < searchResults.length){
		if (searchOutput[a]["display_name"].includes("United States") && !noRep.includes(searchResults[a])){
			document.getElementById("search-results").innerHTML += '<div id="searchRes' + a.toString() + '" class="searchResult" onclick="selectResult(this.id)"><img src="img/location-pin.svg" style="float:left; vertical-align: text-bottom;width: 35px;margin-left: 10px;"><h1 style="margin-left: 40px;">' + searchResults[a] + '</h1></div><br>';
			noRep.push(searchResults[a])
		}
		a++;
		
	}
	if (document.getElementById("search-results").innerHTML == ""){
		document.getElementById("search-results").innerHTML = "<h1>Couldn't find that location!";
	}
	console.log(searchResults);
}

// Add the selected location to the database
function selectResult(id){
	var theSearch = document.getElementById("location-search").value;
	id = id.replace("searchRes", "")
	id = parseInt(id);
	var name = nomItemsToNames(nomSearch(theSearch))[id];
	var searchOutput = nomSearch(theSearch)[id];
	var tempJSON = JSON.parse(localStorage.getItem("weather-locations"));
	var tempJSON2 = JSON.parse(localStorage.getItem("weather-location-names"));
	console.log(tempJSON2);
	console.log(name);
	if (!tempJSON2.includes(name)){
		tempJSON.push(searchOutput);
		tempJSON2.push(name)
		localStorage.setItem("weather-locations", JSON.stringify(tempJSON));
		localStorage.setItem("weather-location-names", JSON.stringify(tempJSON2));
	}
	syncFiles();
	navTo("locations");
}

// Refreshes the information on the locations page
function refreshLocations(){
	if (screenAt != "locations"){
		return;
	}
	var nomLocations = JSON.parse(localStorage.getItem("weather-locations"));
	var nomLocationNames = JSON.parse(localStorage.getItem("weather-location-names"));
	var theSettings = JSON.parse(localStorage.getItem("atmos-settings"));
	var refreshAgain = false;
	locationEnabled = theSettings["location"]["weather"];
	if (nomLocations.length > 0){
		if (locationEnabled){
			document.getElementById("location-main").innerHTML = '<div class="location ' + "currentloc" + '" id="currentLocDiv"><div style="display: inline-block;height: inherit;vertical-align: top;margin-top:35px;"><img style="vertical-align:center;" src="img/' + "current-location" + '.svg"></div><div style="display:inline-block;margin-left:8px;"><h2 id="currentLocTitle">' + "Current Location" + '</h2><h3 id="currentLocData">Loading information...</h3></div></div><br>';
		}
		else{
			document.getElementById("location-main").innerHTML = "";
		}
		document.getElementById("location-data").innerHTML = "";
		var a = 0;
		while (a < nomLocations.length){
			var fullStatus = getStatus(nomLocations[a]);
			var alertStatus = fullStatus[0];
			var image = "sunny"
			var hourly = getHourlyForecast(nomToWeatherGrid(nomLocations[a]));
			if (!hourly[0]){
				if (!refreshAgain){
					refreshAgain = true;
					setTimeout(refreshLocations, 7000);
				}
				var theDiv = '<div class="location ' + "error" + '"><div style="display: inline-block;height: inherit;vertical-align: top;margin-top:35px;"><img style="vertical-align:center;" src="img/' + "error" + '.svg"></div><div style="display:inline-block;margin-left:8px;"><h2>' + nomLocationNames[a] + '</h2><h3>Loading location data...</h3></div></div><br>';
				document.getElementById("location-main").innerHTML += theDiv;
			}
			else{
				var sfor = hourly[0][0]["shortForecast"].toLowerCase();
				var info = hourly[0][0]["temperature"] + " F - " + hourly[0][0]["shortForecast"];
				if (sfor.includes("rain") || sfor.includes("storm") || sfor.includes("drizzle")){
					image = "rainy";
				}
				else if (sfor.includes("snow")){
					image = "snowy";
				}
				else if (sfor.includes("wind")){
					image = "windy";
				}
				else if (sfor.includes("cloud")){
					image = "cloudy";
				}
				if (alertStatus == "warning"){
					image = "warning";
					info = fullStatus[1].toString() + " warning(s) and " + fullStatus[2].toString() + " watche(s)";
				}
				if (alertStatus == "watch"){
					info = fullStatus[2].toString() + " watche(s)";
				}
				if (alertStatus == "other"){
					info = "Weather statements in effect";
				}
				var theDiv = '<div class="location ' + alertStatus + '" onclick="navTo(\'locdat-' + nomLocationNames[a] + '-' + a.toString() + '\')"><div style="display: inline-block;height: inherit;vertical-align: top;margin-top:35px;"><img style="vertical-align:center;" src="img/' + image + '.svg"></div><div style="display:inline-block;margin-left:8px;"><h2>' + nomLocationNames[a] + '</h2><h3>' + info + '&emsp;(Tap for more info.)</h3></div></div><br>';
				document.getElementById("location-main").innerHTML += theDiv;
				document.getElementById("location-data").innerHTML += "<div id='tab-locdat-" + nomLocationNames[a] + '-' + a.toString() + "' class='tab-div' hidden><h1>" + nomLocationNames[a] + "</h1></div>";
			}
			a++;
		}
		document.getElementById("location-main").innerHTML += "<br><br><br><h1>&emsp;</h1>";
	}
	else{
		if (locationEnabled){
			document.getElementById("location-main").innerHTML = '<div class="location ' + "currentloc" + '" id="currentLocDiv"><div style="display: inline-block;height: inherit;vertical-align: top;margin-top:35px;"><img style="vertical-align:center;" src="img/' + "current-location" + '.svg"></div><div style="display:inline-block;margin-left:8px;"><h2 h2 id="currentLocTitle">' + "Current Location" + '</h2><h3 id="currentLocData">Loading information...</h3></div></div><br>';
		}
		else{
			document.getElementById("location-main").innerHTML = '<div class="location"><h2>You have no locations.</h2></div>';
		}
	}
	if (locationEnabled){
		refreshCurrentLocation();
	}
	syncFiles();
}

// Code to run when a page is navigated to
function navCode(screenTo){
	if (screenTo == "locations"){
		setTimeout(refreshLocations, 10);
	}
	if (screenTo.includes("locdat-")){
		loadMoreInfo(screenTo);
	}
	if (screenTo == "alerts"){
		setTimeout(refreshAlerts, 10);
	}
	if (screenTo == "radar"){
		map2.remove();
		map2 = L.map('radar-map').setView([40.58207622, -95.461760283], 3);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    		maxZoom: 19,
    		attribution: '© OpenStreetMap'
		}).addTo(map2);
		setTimeout(function(){
			map2.invalidateSize(true);
			loadRadarData();
			setTimeout(playRadarAnimation, 1000);
			var polygon;
			setTimeout(function(){
				var alerts = getAllActiveAlerts();
				var a = 0;
				while (a < alerts[0].length){
					if (alerts[0][a]["geometry"]){
						if (alerts[0][a]["properties"]["event"].includes("Warning")){
							polygon = L.geoJSON(alerts[0][a]["geometry"], {style:{"color":"red"}}).addTo(map2);
							polygon.bindPopup(alerts[0][a]["properties"]["headline"]);
						}
						else{
							polygon = L.geoJSON(alerts[0][a]["geometry"], {style:{"color":"blue"}}).addTo(map2);
							polygon.bindPopup(alerts[0][a]["properties"]["headline"]);
						}
					}
					a++;
				}
			}, 2000)
		}, 500);
	}
	if (screenTo == "settings"){
		refreshSettings();
		setTimeout(keepSaving, 10);
	}
	if (screenAt == "settings"){
		saveSettings();
	}
}

// Load more information about a location
function loadMoreInfo(navName){
	var index = navName.split("-");
	index = parseInt(index[index.length -1]);
	console.log(index)
	var nomObj = JSON.parse(localStorage.getItem("weather-locations"))[index];
	var nomName = JSON.parse(localStorage.getItem("weather-location-names"))[index];
	var wGrid = nomToWeatherGrid(nomObj);
	var forecast = getForecast(wGrid);
	var hourly = getHourlyForecast(wGrid);
	var image = "sunny"
	var sfor = hourly[0][0]["shortForecast"].toLowerCase();
	if (sfor.includes("rain") || sfor.includes("storm") || sfor.includes("drizzle")){
		image = "rainy";
	}
	else if (sfor.includes("snow")){
		image = "snowy";
	}
	else if (sfor.includes("wind")){
		image = "windy";
	}
	else if (sfor.includes("cloud")){
		image = "cloudy";
	}
	var generatedCode;
	var activeAlertInfo = getWeatherAlertsForNom(nomObj)[0];
	var fullStatus = getStatus(nomObj);
	generatedCode = "<h1>" + nomName + "</h1><br>";
	// Bars at the top of page
	generatedCode += '<div style="margin-right:20px;">'
	// Weather Alert Bar
	var theWarnings = "";
	var b = 0;
	while (b < activeAlertInfo.length){
		theWarnings += "<a href='#' style='color:white;' onclick='loadAlert(\"" + index.toString() + "-" + b +  "\")'>" + activeAlertInfo[b]["properties"]["event"] + "</a>&emsp;"
		b++;
	}
	
	if (fullStatus[0] == "warning"){
		generatedCode += '<div class="location ' + fullStatus[0] + '"><div style="display: inline-block;height: inherit;vertical-align: top;margin-top:20px;"><img style="vertical-align:center;" src="img/warning.svg"></div><div style="display:inline-block;margin-left:8px;"><h1>This location has active warnings!</h1><h3>' + theWarnings + ' (Tap for more.)</h3></div></div><br>';
	}
	if (fullStatus[0] == "watch"){
		generatedCode += '<div class="location ' + fullStatus[0] + '"><div style="display: inline-block;height: inherit;vertical-align: top;margin-top:20px;"><img style="vertical-align:center;" src="img/watch.svg"></div><div style="display:inline-block;margin-left:8px;"><h1>This location has active watches.</h1><h3>' + theWarnings + ' (Tap for more.)</h3></div></div><br>';
	}
	if (fullStatus[0] == "other"){
		theWarnings = theWarnings.replaceAll(",", ", ")
		generatedCode += '<div class="location ' + fullStatus[0] + '"><div style="display: inline-block;height: inherit;vertical-align: top;margin-top:20px;"><img style="vertical-align:center;" src="img/watch.svg"></div><div style="display:inline-block;margin-left:8px;"><h1>This location has active weather statements.</h1><h3>' + theWarnings + ' (Tap for more.)</h3></div></div><br>';
	}
	// Temperature Bar
	generatedCode += '<div class="location ' + fullStatus[0] + '"><div style="display: inline-block;height: inherit;vertical-align: top;margin-top:20px;"><img style="vertical-align:center;" src="img/' + image + '.svg"></div><div style="display:inline-block;margin-left:8px;"><h1>' + hourly[0][0]["temperature"].toString() + '° F</h1><h3>' + hourly[0][0]["shortForecast"] + '</h3></div></div><br>';
	var a = 0;
	// List alert details if any active alerts
	var longHourForecast = "<h1>Hourly Forecast</h1>";
//	if (activeAlertInfo.length > 0){
//		generatedCode += '<h1>Active Weather Alerts</h1>';
//		while (a < activeAlertInfo.length){
//			generatedCode += '<h2>' + activeAlertInfo[a]["properties"]["event"] + "</h2>"
//			generatedCode += '<h4>' + activeAlertInfo[a]["properties"]["description"].replaceAll("\n\n", "<br><br>").replaceAll("\n", " ") + "</h4><br>"
//			a++;
//		}
//	}
	a = 0;
	var forecastTime;
	var AMPM;
	while (a < 12){
		sfor = hourly[0][a]["shortForecast"].toLowerCase();
		longHourForecast += "<div style='box-shadow: 0px 0px 7px #898989;background-color:dodgerblue;color:white;display:inline-block;padding:20px;margin-right:20px;margin-bottom:20px;border-radius:7px;'><center>"
		if (sfor.includes("rain") || sfor.includes("storm") || sfor.includes("drizzle")){
			image = "rainy";
		}
		else if (sfor.includes("snow")){
			image = "snowy";
		}
		else if (sfor.includes("wind")){
			image = "windy";
		}
		else if (sfor.includes("cloud")){
			image = "cloudy";
		}
		else{
			image = "sunny";
		}
		forecastTime = hourly[0][a]["startTime"];
		forecastTime = parseInt(forecastTime.substr(11,2));
		console.log(forecastTime);
		AMPM = "AM";
		if (forecastTime > 11){
			AMPM = "PM";
		}
		if (forecastTime > 12){
			forecastTime -= 12;
		}
		if (forecastTime == 0){
			forecastTime = 12;
		}
		longHourForecast += "<img src='img/" + image + ".svg'>"
		longHourForecast += "<h2>" + hourly[0][a]["temperature"] + "° F</h2>";
		longHourForecast += "<h4>" + forecastTime.toString() + " " + AMPM + "</h4>"
		longHourForecast += "</center></div>"
		a++;
	}
	generatedCode += longHourForecast;
	// Add detailed forecast at bottom
	var theFiveForecast = "<br><h1>NWS Forecast</h1><br>";
	console.log(forecast);
	theFiveForecast += "<h2>" + forecast[0][0]["name"] + "</h2>";
	theFiveForecast += "<h3>" + forecast[0][0]["detailedForecast"] + "</h3><br>"
	theFiveForecast += "<h2>" + forecast[0][1]["name"] + "</h2>";
	theFiveForecast += "<h3>" + forecast[0][1]["detailedForecast"] + "</h3><br>"
	theFiveForecast += "<h2>" + forecast[0][2]["name"] + "</h2>";
	theFiveForecast += "<h3>" + forecast[0][2]["detailedForecast"] + "</h3><br>"
	theFiveForecast += "<h2>" + forecast[0][3]["name"] + "</h2>";
	theFiveForecast += "<h3>" + forecast[0][3]["detailedForecast"] + "</h3><br>"
	theFiveForecast += "<h2>" + forecast[0][4]["name"] + "</h2>";
	theFiveForecast += "<h3>" + forecast[0][4]["detailedForecast"] + "</h3><br>";
	generatedCode += theFiveForecast;
	generatedCode += "<button style='width:100%;background-color:darkslategray;color:white;border:none;border-radius:7px;font-size:20px;font-family:Secular One;' onclick='removeLocation(" + index.toString() + ");'>Remove This Location</button>"
	document.getElementById("tab-" + navName).innerHTML = generatedCode + "</div>";
	
	
}

// Check if a location is under any watches, warnings, etc.
function getStatus(nomObj){
	var warnings = 0;
	var watches = 0;
	var other = 0;
	var weatherAlerts = getWeatherAlertsForNom(nomObj);
	weatherAlerts = weatherAlerts[0];
	var a = 0;
	var warningsList = [];
	var watchesList = [];
	var otherList = [];
	var statList = [];
	// Count the number of watches and warnings
	while (a < weatherAlerts.length){
		console.log(weatherAlerts[a]["properties"]["event"])
		if (weatherAlerts[a]["properties"]["event"].toLowerCase().includes("watch")){
			watchesList.push(weatherAlerts[a]["properties"]["event"]);
			watches++;
		}
		else if (weatherAlerts[a]["properties"]["event"].toLowerCase().includes("warning")){
			warningsList.push(weatherAlerts[a]["properties"]["event"]);
			warnings++;
		}
		else{
			other++;
			otherList.push(weatherAlerts[a]["properties"]["event"]);
		}
		a++;
	}
	statList = warningsList;
	statList = statList.concat(watchesList);
	statList = statList.concat(otherList);
	if (warnings > 0){
		return ["warning", warnings, watches, other, statList];
	}
	else if (watches > 0){
		return ["watch", warnings, watches, other, statList];
	}
	else if (other > 0){
		return ["other", warnings, watches, other, statList];
	}
	else{
		return ["noalerts", warnings, watches, other, statList];
	}
}

// Sync with native code
function syncFiles(){
	if (!getPlatform().includes("desktop")){
		NativeStorage.setItem("settings", JSON.parse(localStorage.getItem("atmos-settings")), function(obj){console.log("Saved settings natively")}, function(obj){console.log(error.exception);console.log(error.code);});
		NativeStorage.setItem("locations", JSON.parse(localStorage.getItem("weather-locations")), function(obj){console.log("Saved locations natively")}, function(obj){console.log(error.exception);console.log(error.code);});
		NativeStorage.setItem("location-names", JSON.parse(localStorage.getItem("weather-location-names")), function(obj){console.log("Saved location names natively")}, function(obj){console.log(error.exception);console.log(error.code);});
		NativeStorage.setItem("location-cache", JSON.parse(localStorage.getItem("nws-location-cache")), function(obj){console.log("Saved location cache natively")}, function(obj){console.log(error.exception);console.log(error.code);});
	}
	else{
		console.log("Electron Version")
	}
}

// Removes a location from the list observed
function removeLocation(index){
	
	var theCache = JSON.parse(localStorage.getItem("weather-locations"));
	var theOtherCache = JSON.parse(localStorage.getItem("weather-location-names"));
	theCache.splice(index, 1);
	theOtherCache.splice(index, 1);
	localStorage.setItem("weather-locations", JSON.stringify(theCache));
	localStorage.setItem("weather-location-names", JSON.stringify(theOtherCache));
	navTo("locations");
}

// Tries to get the current location of the user
function getCurrentLocation(){
	if (navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(coordObj){
			currentLat = coordObj.coords.latitude;
			currentLong = coordObj.coords.longitude;
		}, function(error){
			currentLat = false;
			currentLong = false;
			console.log("Could not get location.")
		})
	}
	else{
		console.log("Geolocation is not available.")
	}
}

// Gets the current location, the passes to function
function getLocationWithFunction(success, error){
	if (navigator.geolocation){
		navigator.geolocation.getCurrentPosition(success, error);
	}
	else{
		console.log("Geolocation is not available.")
	}
}

// Refreshes the current location information
function refreshCurrentLocation(){
	if (locationEnabled){
		var time = new Date();
		// Check if current location data more than two minutes old, if not grab from NWS api
		if ((time.getTime() - lastLocationCheck) > 120*1000){
			getLocationWithFunction(function(coordObj){
					currentLat = coordObj.coords.latitude;
					currentLong = coordObj.coords.longitude;
					try{
						var weatherGrid = JSONGet("https://api.weather.gov/points/" + currentLat.toString() + "," + currentLong.toString());
						var hourlyForecastLink = weatherGrid["properties"]["forecastHourly"]
						var hourlyForecast = JSONGet(hourlyForecastLink);
						hourlyForecast = hourlyForecast["properties"]["periods"][0];
						var info = hourlyForecast["temperature"] + " F - " + hourlyForecast["shortForecast"];
						document.getElementById("currentLocData").innerHTML = info;
						document.getElementById("currentLocTitle").innerHTML = "Current Location (" + currentLat.toString() + ", " + currentLong.toString() + ")";
						var theTime = new Date();
						lastLocationCheck = theTime.getTime();
						lastLocationInfo = info;
					}
					catch(err){
						document.getElementById("currentLocData").innerHTML = "An error occurred.";
						document.getElementById("currentLocTitle").innerHTML = "Current Location (" + currentLat.toString() + ", " + currentLong.toString() + ")";
					}
				}, function(error){
				document.getElementById("currentLocData").innerHTML = "Please allow location permission or disable this in app settings.";
			}
			);
		}
		else{
			document.getElementById("currentLocData").innerHTML = lastLocationInfo;
			document.getElementById("currentLocTitle").innerHTML = "Current Location (" + currentLat.toString() + ", " + currentLong.toString() + ")";
		}
	}
}

// Refreshes the alerts tab
function refreshAlerts(){
	checkIfOldAlerts()
	var currentAlerts = JSON.parse(localStorage.getItem("nws-alerts-current"));
	var oldAlerts = JSON.parse(localStorage.getItem("nws-alerts-old"));
	var a = 0;
	var generatedCode = "";
	while (a < currentAlerts.length){
		if (currentAlerts[a] != null){
			generatedCode += "<h2>" + currentAlerts[a]["properties"]["event"] + "</h2>"
			generatedCode += "<h4>" + currentAlerts[a]["properties"]["headline"] + "</h4>"
			generatedCode += "<h4>" + currentAlerts[a]["properties"]["areaDesc"] + "</h4>"
			if (currentAlerts[a]["properties"]["instruction"] != null){
				generatedCode += "<h4>" + currentAlerts[a]["properties"]["instruction"] + "</h4><br>";
			}
		}
		a++;
	}
	if (a == 0){
		generatedCode = "<h2>There are currently no active alerts for your locations.</h2>"
	}
	document.getElementById("active-alert-list").innerHTML = generatedCode;
	
	generatedCode = "";
	a = 0;
	while (a < oldAlerts.length){
		if (oldAlerts[a] != null){
			generatedCode += "<h2>" + oldAlerts[a]["properties"]["event"] + "</h2>"
			generatedCode += "<h4>" + oldAlerts[a]["properties"]["headline"] + "</h4>"
			generatedCode += "<h4>" + oldAlerts[a]["properties"]["areaDesc"] + "</h4><br>"
		}
		a++;
	}
	if (a == 0){
		generatedCode = "<h2>You have no previously recieved alerts.</h2>"
	}
	document.getElementById("old-alert-list").innerHTML = generatedCode;
}

// Loads the information for an alert and displays it
function loadAlert(alertID){
	clearMap();
	var theSplit = alertID.split("-");
	var locationIndex = parseInt(theSplit[0]);
	var alertIndex = parseInt(theSplit[1]);
	var theLocation = JSON.parse(localStorage.getItem("weather-locations"))[locationIndex];
	console.log(locationIndex)
	console.log(theLocation)
	//map.setView([parseInt(theLocation["lat"]), parseInt(theLocation["lon"])])
	var theAlert = getWeatherAlertsForNom(theLocation);
	theAlert = theAlert[0][alertIndex];
	var alertBoundries = getPolyBoundries(theAlert, nomToWeatherGrid(theLocation));
	document.getElementById("weather-alert-title").innerHTML = theAlert["properties"]["headline"];
	var divCode = "<h2>Areas Affected</h2>"
	divCode += "<h3>" + theAlert["properties"]["areaDesc"] + "</h3>"
	if (theAlert["properties"]["instruction"] != null){
		divCode += "<h2>Instructions</h2>"
		divCode += "<h3>" + theAlert["properties"]["instruction"] + "</h3>"
	}
	divCode += "<h2>Details</h2>"
	var theDetails = theAlert["properties"]["description"]
	theDetails = theDetails.replaceAll("\n\n", "<br><br>");
	theDetails = theDetails.replaceAll("\n", " ");
	theDetails = theDetails.replaceAll("* ", "");
	theDetails = theDetails.replaceAll("...", " - ");
	theDetails = theDetails.replaceAll("- -", "-")
	divCode += "<h3>" + theDetails + "</h3>"
	document.getElementById("alert-details").innerHTML = divCode;
	if (theAlert["properties"]["event"].toLowerCase().includes("warning")){
		polygon = L.geoJSON(alertBoundries["geometry"], {style:{"color":"red"}}).addTo(map);
	}
	else if (theAlert["properties"]["event"].toLowerCase().includes("watch")){
		polygon = L.geoJSON(alertBoundries["geometry"], {style:{"color":"yellow"}}).addTo(map);
	}
	else{
		polygon = L.geoJSON(alertBoundries["geometry"]).addTo(map);
	}
	navTo("alert-display")
	setTimeout(function(){
		map.invalidateSize(true)
	}, 1000)
	setTimeout(function(){
		map.fitBounds(polygon.getBounds());
	}, 2000);
}

// Clears polygons from the LeafletJS alert map
function clearMap() {
    for(i in map._layers) {
        if(map._layers[i]._path != undefined) {
            try {
                map.removeLayer(map._layers[i]);
            }
            catch(e) {
                console.log("problem with " + e + map._layers[i]);
            }
        }
    }
}

function playAlarmSoundMain(){
	var audio = new Audio('audio/' + document.getElementById("setting-default-sound-alert").value + 'alarm.mp3');
	audio.play();
}
function playNotificationSoundMain(){
	var audio = new Audio('audio/' + document.getElementById("setting-default-sound-notification").value + 'notification.mp3');
	audio.play();
}
function playAlarmSoundLocation(){
	var audio = new Audio('audio/' + document.getElementById("setting-default-sound-alert-location").value + 'alarm.mp3');
	audio.play();
}
function playNotificationSoundLocation(){
	var audio = new Audio('audio/' + document.getElementById("setting-default-sound-notification-location").value + 'notification.mp3');
	audio.play();
}

// Cycles through the native welcome screen slides
function showNextIntro(){
	document.getElementById("fade-section").setAttribute("style", "animation: simpleFadeOut 0.5s; animation-fill-mode: forwards;");
	setTimeout(function(){
		document.getElementById("fade-section").setAttribute("style", "animation: simpleFadeIn 2s; animation-fill-mode: forwards;");
		if (document.getElementById("welcome-title-native").innerHTML == "Welcome To Atmos Weather"){
			document.getElementById("welcome-title-native").innerHTML = "Prepare For The Day Ahead";
			document.getElementById("welcome-body-native").innerHTML = "With forecast notifications for rain, storms, and severe weather, never get caught unprepared again.";
			document.getElementById("welcome-image-native").setAttribute("src", "img/storm-illustration.svg");
		}
		else if (document.getElementById("welcome-title-native").innerHTML == "Prepare For The Day Ahead"){
			document.getElementById("welcome-title-native").innerHTML = "Stay Safe And Informed";
			document.getElementById("welcome-body-native").innerHTML = "Atmos Weather gives highly detailed weather alert notifications and provides all the information you need to make critical decisions.<br>Alert polygons are shown on a map to give more exact details on location.";
			document.getElementById("welcome-image-native").setAttribute("src", "img/push-notifications.svg");
		}
		else if (document.getElementById("welcome-title-native").innerHTML == "Stay Safe And Informed"){
			document.getElementById("welcome-title-native").innerHTML = "Everywhere You Care About";
			document.getElementById("welcome-body-native").innerHTML = "Atmos Weather doesn't limit features to a single location.<br>You can add as many locations as you want and experience the full power of Atmos Weather for each one.";
			document.getElementById("welcome-image-native").setAttribute("src", "img/location-search.svg");
		}
		else if (document.getElementById("welcome-title-native").innerHTML == "Everywhere You Care About"){
			document.getElementById("welcome-title-native").innerHTML = "Privacy First";
			document.getElementById("welcome-body-native").innerHTML = "No tracking. No data selling.<br>Atmos Weather only uses the information necessary to provide app features.<br>Minimal data is received by the National Weather Service and Open Street Map.";
			document.getElementById("welcome-image-native").setAttribute("src", "img/privacy.svg");
		}
		else if (document.getElementById("welcome-title-native").innerHTML == "Privacy First"){
			document.getElementById("welcome-title-native").innerHTML = "No Bloat";
			document.getElementById("welcome-body-native").innerHTML = "Built on free services, Atmos Weather doesn't need to inject ads or other trackers to make a profit.<br>This allows Atmos to be free of the junk that slows down most apps.";
			document.getElementById("welcome-image-native").setAttribute("src", "img/fast-loading.svg");
		}
		else{
			document.getElementById("welcome-window-native").setAttribute("style", "animation: simpleFadeOut 2s; animation-fill-mode: forwards;");
			localStorage.setItem("run-before", "true");
			showNotices();
			setTimeout(function(){document.getElementById("welcome-window-native").hidden=true;}, 2000);
		}
		
	}, 750);
}