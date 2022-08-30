/*
	nws-api.js
	Handles the caching and fetching of forcasts, alerts, and other information from the National Weather Service API
*/


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
function nomToWeatherGrid(nomObj){
	var theCache = JSON.parse(localStorage.getItem("nws-location-cache"));
	var temp;
	temp = nomObj["display_name"];
	temp = temp.split(", ");
	temp = temp[0] + ", " + temp[1] + ", " + temp[2];
	if (theCache.hasOwnProperty(temp)){
		return [JSON.parse(theCache[temp]), temp];
	}
	else{
		theCache[temp] = httpGet("https://api.weather.gov/points/" + nomObj["lat"] + "," + nomObj["lon"]);
		localStorage.setItem("nws-location-cache", JSON.stringify(theCache));
		syncFiles();
		return [JSON.parse(theCache[temp]), temp];
	}
}

// Get hourly forecast information from weather grid returned by above function
function getHourlyForecast(weatherGrid){
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
			return theCache[weatherGrid[1]];
		}
		else{
			var hourlyForecastLink = weatherGrid[0]["properties"]["forecastHourly"]
			var hourlyForecast = JSON.parse(httpGet(hourlyForecastLink));
			hourlyForecast = hourlyForecast["properties"]["periods"];
			theCache[weatherGrid[1]] = [hourlyForecast, time.getTime()];
			localStorage.setItem("nws-hourly-forecast-cache", JSON.stringify(theCache));
			document.getElementById("offlineError").hidden = true;
			return theCache[weatherGrid[1]];
		}
	}
	catch(err){
		return [false, hourlyForecast];
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
	try{
		var theAlerts = JSONGet("https://api.weather.gov/alerts/active?point=" + lat.toString() + "," + long.toString())["features"];
		addToActiveAlertsCheck(theCache[pos])
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

// Gets the polygon boundry of weather alerts
function getPolyBoundries(weatherAlert, wGrid){
	if (weatherAlert["geometry"] == null){
		var theCache = JSON.parse(localStorage.getItem("nws-boundries-cache"));
		var forecastZone = wGrid[0]["properties"]["forecastZone"];
		if (theCache.hasOwnProperty(forecastZone)){
			return theCache[forecastZone];
		}
		else{
			var theBoundries = JSONGet(forecastZone);
			theCache[forecastZone] = theBoundries;
			localStorage.setItem("nws-boundries-cache", JSON.stringify(theCache));
			return theBoundries;
		}
	}
	else{
		return weatherAlert;
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