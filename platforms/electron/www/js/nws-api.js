// nws-api - Grab Weather Data from the National Weather Service API


// Set up empty storage
if (!localStorage.getItem("nws-location-cache")){
	localStorage.setItem("nws-location-cache", "{}");
	localStorage.setItem("nws-forecast-cache", "{}")
	localStorage.setItem("nws-hourly-forecast-cache", "{}")
}

// Convert a Nominatim object into a weather grid object
function nomToWeatherGrid(nomObj){
	var theCache = JSON.parse(localStorage.getItem("nws-location-cache"));
	var temp;
	temp = nomObj["display_name"];
	temp = temp.split(", ");
	temp = temp[0] + ", " + temp[1] + ", " + temp[2];
	console.log(temp);
	if (theCache.hasOwnProperty(temp)){
		console.log("Getting grid location from cache");
		return [JSON.parse(theCache[temp]), temp];
	}
	else{
		console.log("Getting grid locations from NWS API");
		theCache[temp] = httpGet("https://api.weather.gov/points/" + nomObj["lat"] + "," + nomObj["lon"]);
		localStorage.setItem("nws-location-cache", JSON.stringify(theCache));
		return [JSON.parse(theCache[temp]), temp];
	}
}

// Get hourly forecast information from weather grid returned by above function
function getHourlyForecast(weatherGrid){
	try{
		console.log("Weather grid: ")
		console.log(weatherGrid);
		console.log(weatherGrid[1])
		var theCache = JSON.parse(localStorage.getItem("nws-hourly-forecast-cache"));
		var useCache = false;
		var time = new Date();
		// Check if has forecast from last five minutes
		if (theCache.hasOwnProperty(weatherGrid[1])){
			if ((time.getTime() - theCache[weatherGrid[1]][1]) < 300*1000){
				console.log("Using cache for forecast")
				useCache = true;
			}
		}
		if (useCache){
			return theCache[weatherGrid[1]];
		}
		else{
			console.log("Grabbing forecast from NWS")
			var hourlyForecastLink = weatherGrid[0]["properties"]["forecastHourly"]
			var hourlyForecast = JSON.parse(httpGet(hourlyForecastLink));
			hourlyForecast = hourlyForecast["properties"]["periods"];
			theCache[weatherGrid[1]] = [hourlyForecast, time.getTime()];
			localStorage.setItem("nws-hourly-forecast-cache", JSON.stringify(theCache));
			return theCache[weatherGrid[1]];
		}
	}
	catch(err){
		console.log(hourlyForecast)
		return [false, hourlyForecast];
	}
}

// Get full forecast information
function getForecast(weatherGrid){
	try{
	console.log(weatherGrid);
	var theCache = JSON.parse(localStorage.getItem("nws-forecast-cache"));
	var useCache = false;
	var time = new Date();
	
	// Check if has forecast from last five minutes
	if (theCache.hasOwnProperty(weatherGrid[1])){
		if ((time.getTime() - theCache[weatherGrid[1]][1]) < 300*1000){
			console.log("Using cache for forecast")
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
		return theCache[weatherGrid[1]];
	}
	}
	catch (err){
		console.log(forecast);
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
function getWeatherAlerts(lat, long){
	try{
		var theAlerts = JSONGet("https://api.weather.gov/alerts/active?point=" + lat.toString() + "," + long.toString())["features"];
		return theAlerts;
	}
	catch(err){
		return false;
	}
}