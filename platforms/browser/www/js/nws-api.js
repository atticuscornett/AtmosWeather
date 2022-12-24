/*
	nws-api.js
	Handles the caching and fetching of forecasts, alerts, and other information from the National Weather Service API
*/

// Keep downloaded polygons until page reload.
var tempPolyCache = {};
var tempPolyFireCache = {}
var missed = [];

// Set up empty storage
if (!localStorage.getItem("nws-location-cache")){
	localStorage.setItem("nws-location-cache", "{}");
	localStorage.setItem("nws-forecast-cache", "{}");
	localStorage.setItem("nws-hourly-forecast-cache", "{}");
	localStorage.setItem("nws-alerts-cache", "{}");
	localStorage.setItem("nws-alerts-old", "[]");
	localStorage.setItem("nws-alerts-current", "[]");
	localStorage.setItem("nws-boundries-cache", "{}");
}

// Convert a Nominatim object into a weather grid object
function nomToWeatherGridAsync(nomObj, nomCallback, extraReturn=null){
	var theCache = JSON.parse(localStorage.getItem("nws-location-cache"));
	var temp;
	temp = nomObj["display_name"];
	temp = temp.split(", ");
	temp = temp[0] + ", " + temp[1] + ", " + temp[2];
	if (theCache.hasOwnProperty(temp)){
		if (extraReturn != null){
			nomCallback([JSON.parse(theCache[temp]), temp], extraReturn);
		}
		else{
			nomCallback([JSON.parse(theCache[temp]), temp]);
		}
	}
	else{
		httpGetAsync("https://api.weather.gov/points/" + nomObj["lat"] + "," + nomObj["lon"], (res) => {
			theCache[temp] = res;
			localStorage.setItem("nws-location-cache", JSON.stringify(theCache));
			syncFiles();
			if (extraReturn != null){
				nomCallback([JSON.parse(theCache[temp]), temp], extraReturn);
			}
			else{
				nomCallback([JSON.parse(theCache[temp]), temp]);
			}
		});
	}
}

// Get hourly forecast information from weather grid returned by above function
function getHourlyForecastAsync(weatherGrid, hourlyCallback, extraReturn=null){
	try{
		var theCache = JSON.parse(localStorage.getItem("nws-hourly-forecast-cache"));
		var useCache = false;
		var time = new Date();
		// Check if has forecast from last five minutes
		if (theCache.hasOwnProperty(weatherGrid[1])){
			if ((time.getTime() - theCache[weatherGrid[1]][1]) < 300*1000){
				useCache = true;
			}
		}
		if (useCache){
			if (extraReturn != null){
				hourlyCallback(theCache[weatherGrid[1]], extraReturn);
			}
			else{
				hourlyCallback(theCache[weatherGrid[1]]);
			}
		}
		else{
			var hourlyForecastLink = weatherGrid[0]["properties"]["forecastHourly"]
			var hourlyForecast = JSON.parse(httpGet(hourlyForecastLink));
			hourlyForecast = hourlyForecast["properties"]["periods"];
			theCache[weatherGrid[1]] = [hourlyForecast, time.getTime()];
			localStorage.setItem("nws-hourly-forecast-cache", JSON.stringify(theCache));
			document.getElementById("offlineError").hidden = true;
			if (extraReturn != null){
				hourlyCallback(theCache[weatherGrid[1]], extraReturn);
			}
			else{
				hourlyCallback(theCache[weatherGrid[1]]);
			}
		}
	}
	catch(err){
		if (extraReturn != null){
			hourlyCallback([false, hourlyForecast], extraReturn);
		}
		else{
			hourlyCallback([false, hourlyForecast]);
		}
	}
}

// Get full forecast information
function getForecast(weatherGrid){
	try{
	var theCache = JSON.parse(localStorage.getItem("nws-forecast-cache"));
	var useCache = false;
	var time = new Date();
	
	// Check if has forecast from last five minutes
	if (theCache.hasOwnProperty(weatherGrid[1])){
		if ((time.getTime() - theCache[weatherGrid[1]][1]) < 300*1000){
			useCache = true;
		}
	}
	if (useCache){
		return theCache[weatherGrid[1]];
	}
	else{
		var forecastLink = weatherGrid[0]["properties"]["forecast"]
		var forecast = JSON.parse(httpGet(forecastLink));
		forecast = forecast["properties"]["periods"];
		theCache[weatherGrid[1]] = [forecast, time.getTime()];
		localStorage.setItem("nws-forecast-cache", JSON.stringify(theCache));
		document.getElementById("offlineError").hidden = true;
		return theCache[weatherGrid[1]];
	}
	}
	catch (err){
		return [false, forecast];
	}
	
}

// Get hourly for current location (requires prior successful run of getCurrentLocation [atmos-ui.js])
function getHourlyGeo(){
	if (!currentLat){
		return false;
	}
	var weatherGrid = JSONGet("https://api.weather.gov/points/" + currentLat.toString() + "," + currentLong.toString());
	var hourlyForecastLink = weatherGrid["properties"]["forecastHourly"]
	var hourlyForecast = JSON.parse(httpGet(hourlyForecastLink));
	hourlyForecast = hourlyForecast["properties"]["periods"];
	return hourlyForecast;
}

// Get full forecast of current location (requires prior successful run of getCurrentLocation [atmos-ui.js])
function getForecastGeo(){
	if (!currentLat){
		return false;
	}
	var weatherGrid = JSONGet("https://api.weather.gov/points/" + currentLat.toString() + "," + currentLong.toString());
	var forecastLink = weatherGrid["properties"]["forecast"]
	var forecast = JSON.parse(httpGet(forecastLink));
	forecast = forecast["properties"]["periods"];
	return forecast;
}

// Gets active weather alerts for a location
function getWeatherAlertsForPos(lat, long){
	var theCache = JSON.parse(localStorage.getItem("nws-location-cache"));
	try{
		var theAlerts = JSONGet("https://api.weather.gov/alerts/active?point=" + lat.toString() + "," + long.toString())["features"];
		addToActiveAlertsCheck(theAlerts);
		return theAlerts;
	}
	catch(err){
		return false;
	}
}

// Gets active weather alerts for a nominatim object
function getWeatherAlertsForNom(nomObj){
	try{
		var pos = nomObj["lat"].toString() + "," + nomObj["lon"].toString();
		var theCache = JSON.parse(localStorage.getItem("nws-alerts-cache"));
		var time = new Date();
		if (theCache.hasOwnProperty(pos)){
			// Check if got alerts within last minute
			if ((time.getTime() - theCache[pos][1]) > 60*1000){
				theCache[pos] = [JSONGet("https://api.weather.gov/alerts/active?point=" + pos)["features"], time.getTime()]
				localStorage.setItem("nws-alerts-cache", JSON.stringify(theCache));
				addToActiveAlertsCheck(theCache[pos]);
				return theCache[pos];
			}
			else{
				return theCache[pos];
			}
		}
		else{
			theCache[pos] = [JSONGet("https://api.weather.gov/alerts/active?point=" + pos)["features"], time.getTime()]
			localStorage.setItem("nws-alerts-cache", JSON.stringify(theCache));
			addToActiveAlertsCheck(theCache[pos]);
			return theCache[pos];
		}
	}
	catch(err){
		return false;
	}
}

// Checks if weather alert should be added to the active alerts
function addToActiveAlertsCheck(alerts){
	var theCache = JSON.parse(localStorage.getItem("nws-alerts-current"));
	var a = 0;
	while (a < alerts.length){
		if (!theCache.includes(alerts[a][0])){
			theCache.push(alerts[a][0]);
		}
		a++;
	}
	localStorage.setItem("nws-alerts-current", JSON.stringify(theCache))
}

// Checks if weather alerts should be moved from current to old
function checkIfOldAlerts(){
	var nomLocations = JSON.parse(localStorage.getItem("weather-locations"));
	var a = 0;
	var allCurrent = [];
	var cacheCurrent = JSON.parse(localStorage.getItem("nws-alerts-current"));
	var moveToOld = [];
	while (a < nomLocations.length){
		allCurrent = allCurrent.concat(getWeatherAlertsForNom(nomLocations[a])[0]);
		a++;
	}
	a = 0;
	var ids = [];
	while (a < allCurrent.length){
		ids.push(allCurrent[a]["id"])
		a++;
	}
	a = 0;
	while (a < cacheCurrent.length){
		if (cacheCurrent[a] != null){
			if (!ids.includes(cacheCurrent[a]["id"])){
				moveToOld.push(cacheCurrent[a]);
			}
		}
		a++;
	}
	localStorage.setItem("nws-alerts-current", JSON.stringify(allCurrent));
	var oldAlerts = JSON.parse(localStorage.getItem("nws-alerts-old"))
	oldAlerts = oldAlerts.concat(moveToOld);
	oldAlerts = oldAlerts.slice(-20);
	localStorage.setItem("nws-alerts-old", JSON.stringify(oldAlerts));
}

// Changes list of coords from longitude, latitude to latitude, longitude
function fixNWSCoords(oldCoords){
	var fixedCoords = [];
	var a = 0;
	var temp;
	while (a < oldCoords.length){
		temp = [oldCoords[a][1], oldCoords[a][0]];
		fixedCoords.push(temp);
		a++;
	}
	return fixedCoords;
}

// Gets the polygon boundary of weather alerts
function getPolyBoundries(weatherAlert){
	if (weatherAlert["geometry"] == null){
		var theCache = JSON.parse(localStorage.getItem("nws-boundries-cache"));
		var forecastZone;
		var a = 0;
		var zonesGeo = []
		var theBoundries;
		// if (weatherAlert["properties"]["affectedZones"][0].includes("fire")){
		// 	while (a < weatherAlert["properties"]["affectedZones"].length){
		// 		missed.push(weatherAlert["properties"]["affectedZones"][a])
		// 		if(!(weatherAlert["properties"]["affectedZones"][a] in theCache)){
		// 			theCache[weatherAlert["properties"]["affectedZones"][a]] = JSONGet(weatherAlert["properties"]["affectedZones"][a]);
		// 		}
		// 		zonesGeo.push(theCache[weatherAlert["properties"]["affectedZones"][a]]);
		// 		a++;
		// 	}
			
		// 	localStorage.setItem("nws-boundries-cache", JSON.stringify(theCache));
		// 	return zonesGeo;
		// }
		while (a < weatherAlert["properties"]["affectedZones"].length){
			forecastZone = weatherAlert["properties"]["affectedZones"][a];
			if (forecastZone.includes("county")){
				a++;
				continue;
			}
			theBoundries = getForecastZonePoly(forecastZone);
			if (theBoundries == false){
				missed.push(forecastZone);
				theBoundries = JSONGet(forecastZone);
			}
			zonesGeo.push(theBoundries);
			theCache[forecastZone] = theBoundries;
			a++;
		}
		return zonesGeo;
	}
	else{
		return [weatherAlert];
	}
}

// Gets all active weather alerts
function getAllActiveAlerts(){
	try{
		var pos = "9999,9999";
		var theCache = JSON.parse(localStorage.getItem("nws-alerts-cache"));
		var time = new Date();
		if (theCache.hasOwnProperty(pos)){
			// Check if got alerts within last minute
			if ((time.getTime() - theCache[pos][1]) > 60*1000){
				theCache[pos] = [JSONGet("https://api.weather.gov/alerts/active")["features"], time.getTime()]
				localStorage.setItem("nws-alerts-cache", JSON.stringify(theCache));
				return theCache[pos];
			}
			else{
				return theCache[pos];
			}
		}
		else{
			theCache[pos] = [JSONGet("https://api.weather.gov/alerts/active")["features"], time.getTime()]
			localStorage.setItem("nws-alerts-cache", JSON.stringify(theCache));
			return theCache[pos];
		}
	}
	catch(err){
		return false;
	}
}

// Get polygon for forecast zone
function getForecastZonePoly(forecastZone){
	let allSettings = JSON.parse(localStorage.getItem("atmos-settings"));
	if (forecastZone.includes("fire")){
		return getFireZonePoly(forecastZone);
	}
	var zoneCode = forecastZone.substring(39);
	var zoneNum = Number(zoneCode.substring(3));
	var zoneId = zoneCode.substring(0,2);
	var eo = "odd";
	if (zoneNum % 2 == 0){
		eo = "even"
	}
	if (allSettings["radar"]["polygons"]["high-res"]){
		eo += "-highres";
	}
	var fullCode = zoneId + "-" + eo;
	if (fullCode in tempPolyCache){
		areaData = tempPolyCache[fullCode];
	}
	else{
		try{
			areaData = JSONGet("https://atticuscornett.github.io/AtmosWeather/data/geometry/forecastZones/" + zoneId + "-" + eo + ".json")
			tempPolyCache[fullCode] = areaData;
		}
		catch(err){
			areaData = {};
		}
	}
	if (zoneCode in areaData){
		return areaData[zoneCode];
	}
	return false;
}

// Get polygon for fire forecast zone
function getFireZonePoly(forecastZone){
	let allSettings = JSON.parse(localStorage.getItem("atmos-settings"));
	var zoneCode = forecastZone.substring(35);
	var zoneNum = Number(zoneCode.substring(3));
	var zoneId = zoneCode.substring(0,2);
	var eo = "odd";
	if (zoneNum % 2 == 0){
		eo = "even"
	}
	if (allSettings["radar"]["polygons"]["high-res"]){
		eo += "-highres";
	}
	var fullCode = zoneId + "-" + eo;
	if (fullCode in tempPolyFireCache){
		areaData = tempPolyFireCache[fullCode];
	}
	else{
		try{
			areaData = JSONGet("https://atticuscornett.github.io/AtmosWeather/data/geometry/fireZones/" + zoneId + "-" + eo + ".json")
			tempPolyFireCache[fullCode] = areaData;
		}
		catch(err){
			areaData = {};
		}
	}
	if (zoneCode in areaData){
		return areaData[zoneCode];
	}
	return false;
}

// Sort events for radar display
function sortByEventType(alertsList){
	var allSettings = JSON.parse(localStorage.getItem("atmos-settings"));
	var a = 0;
	var watchesL = [];
	var otherL = [];
	var warningL = [];
	while (a < alertsList[0].length){
		if (alertsList[0][a]["properties"]["event"].toLowerCase().includes("warning")){
			if (allSettings["radar"]["polygons"]["warnings"]){
				warningL.push(alertsList[0][a]);
			}
		}
		else if (alertsList[0][a]["properties"]["event"].toLowerCase().includes("watch")){
			if (allSettings["radar"]["polygons"]["watch"]){
				watchesL.push(alertsList[0][a]);
			}
		}
		else{
			if (allSettings["radar"]["polygons"]["advisories"]){
				otherL.push(alertsList[0][a]);
			}
		}
		a++;
	}
	var orgList = [];
	orgList = orgList.concat(watchesL);
	orgList = orgList.concat(otherL);
	orgList = orgList.concat(warningL);
	alertsList[0] = orgList;
	return alertsList;
}