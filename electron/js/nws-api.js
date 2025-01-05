/*
	nws-api.js
	Handles the caching and fetching of forecasts, alerts, and other information from the National Weather Service API
*/

// Keep downloaded polygons until page reload.
let tempPolyCache = {};
let tempPolyFireCache = {}
let tempPolyCountyCache = {}
let missed = [];

// Set up empty storage
if (!localStorage.getItem("nws-location-cache")){
	localStorage.setItem("nws-location-cache", "{}");
	localStorage.setItem("nws-forecast-cache", "{}");
	localStorage.setItem("nws-hourly-forecast-cache", "{}");
	localStorage.setItem("nws-alerts-cache", "{}");
	localStorage.setItem("nws-alerts-old", "[]");
	localStorage.setItem("nws-alerts-current", "[]");	
}
if (!localStorage.getItem("nws-boundaries-cache")){
	localStorage.setItem("nws-boundaries-cache", "{}");
}

/**
 * Converts a Nominatim object into a weather grid object.
 *
 * @param {Object} nomObj - The Nominatim object containing location information.
 * @param {Function} nomCallback - The callback function to handle the weather grid object.
 * @param {any} [extraReturn=null] - Additional data to return with the callback.
 */
function nomToWeatherGridAsync(nomObj, nomCallback, extraReturn=null){
	let theCache = JSON.parse(localStorage.getItem("nws-location-cache"));
	let temp;
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

/**
 * Fetches the hourly forecast asynchronously.
 *
 * @param {Object} weatherGrid - The weather grid object containing forecast link information.
 * @param {Function} hourlyCallback - The callback function to handle the hourly forecast data.
 * @param {any} [extraReturn=null] - Additional data to return with the callback.
 */
function getHourlyForecastAsync(weatherGrid, hourlyCallback, extraReturn=null){
	try {
		let theCache = JSON.parse(localStorage.getItem("nws-hourly-forecast-cache"));
		let useCache = false;
		let time = new Date();
		// Check if cache has forecast from last five minutes
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
			let hourlyForecastLink = weatherGrid[0]["properties"]["forecastHourly"]
			addLoadingKey(hourlyForecastLink);
			httpGetAsync(hourlyForecastLink, (hourlyForecast)=>{
				removeLoadingKey(hourlyForecastLink);
				try {
					hourlyForecast = JSON.parse(hourlyForecast);
					hourlyForecast = hourlyForecast["properties"]["periods"];
					theCache[weatherGrid[1]] = [hourlyForecast, time.getTime()];
					localStorage.setItem("nws-hourly-forecast-cache", JSON.stringify(theCache));
					syncFiles();
					setNWSAvailable(true);
					if (extraReturn != null){
						hourlyCallback(theCache[weatherGrid[1]], extraReturn);
					}
					else{
						hourlyCallback(theCache[weatherGrid[1]]);
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
			})
		}
	}
	catch(err){
		console.log(err);
	}
}

/**
 * Retrieves the status of weather alerts for a given Nominatim object.
 *
 * @param {Object} nomObj - The Nominatim object containing location information.
 * @param {Function} callback - The callback function to handle the status of weather alerts.
 * @param {any} [extraReturn=null] - Additional data to return with the callback.
 */
function getStatusAsync(nomObj, callback, extraReturn=null){
	let warnings = 0;
	let watches = 0;
	let other = 0;
	getWeatherAlertsForNomAsync(nomObj, (weatherAlerts) => {
		weatherAlerts = weatherAlerts[0];
		let a = 0;
		let warningsList = [];
		let watchesList = [];
		let otherList = [];
		let statList = [];
		// Count the number of watches and warnings
		while (a < weatherAlerts.length){
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
		let toReturn;
		if (warnings > 0){
			toReturn = ["warning", warnings, watches, other, statList];
		}
		else if (watches > 0){
			toReturn = ["watch", warnings, watches, other, statList];
		}
		else if (other > 0){
			toReturn =  ["other", warnings, watches, other, statList];
		}
		else{
			toReturn = ["noalerts", warnings, watches, other, statList];
		}
		if (extraReturn != null){
			callback(toReturn, extraReturn, weatherAlerts);
		}
		else{
			callback(toReturn, weatherAlerts);
		}
	});
}

/**
 * Fetches the full forecast information asynchronously.
 *
 * @param {Object} weatherGrid - The weather grid object containing forecast link information.
 * @param {Function} forecastCallback - The callback function to handle the forecast data.
 * @param {any} [extraReturn=null] - Additional data to return with the callback.
 */
function getForecastAsync(weatherGrid, forecastCallback, extraReturn=null){
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
			if (extraReturn != null){
				forecastCallback(theCache[weatherGrid[1]], extraReturn);
			}
			else{
				forecastCallback(theCache[weatherGrid[1]]);
			}
		}
		else{
			var forecastLink = weatherGrid[0]["properties"]["forecast"]
			addLoadingKey(forecastLink);
			JSONGetAsync(forecastLink, (forecast) => {
				removeLoadingKey(forecastLink);
				try{
					forecast = forecast["properties"]["periods"];
					theCache[weatherGrid[1]] = [forecast, time.getTime()];
					localStorage.setItem("nws-forecast-cache", JSON.stringify(theCache));
					syncFiles();
					setNWSAvailable(true);
					if (extraReturn != null){
						forecastCallback(theCache[weatherGrid[1]], extraReturn);
					}
					else{
						forecastCallback(theCache[weatherGrid[1]]);
					}
				}
				catch (err){
					if (extraReturn != null){
						forecastCallback([false, forecast], extraReturn);
					}
					else{
						forecastCallback([false, forecast]);
					}
				}
			});
		}
	}
	catch (err){
		if (extraReturn != null){
			forecastCallback([false, forecast], extraReturn);
		}
		else{
			forecastCallback([false, forecast]);
		}
	}
	
}

/**
 * Gets active weather alerts for a location specified by latitude and longitude.
 *
 * @param {number} lat - The latitude of the location.
 * @param {number} long - The longitude of the location.
 * @param {Function} callback - The callback function to handle the weather alerts.
 * @param {any} [extraReturn=null] - Additional data to return with the callback.
 */
function getWeatherAlertsForPosAsync(lat, long, callback, extraReturn=null){
	getWeatherAlertsForNomAsync({"lat": lat, "lon": long}, (alerts)=>{
		callback(alerts[0]);
	}, extraReturn);
}

/**
 * Gets weather alerts for a given Nominatim object asynchronously.
 *
 * @param {Object} nomObj - The Nominatim object containing location information.
 * @param {Function} nomCallback - The callback function to handle the weather alerts.
 * @param {any} [extraReturn=null] - Additional data to return with the callback.
 */
function getWeatherAlertsForNomAsync(nomObj, nomCallback, extraReturn=null){
	try{
		let pos = nomObj["lat"].toString() + "," + nomObj["lon"].toString();
		let theCache = JSON.parse(localStorage.getItem("nws-alerts-cache"));
		let time = new Date();
		if (theCache.hasOwnProperty(pos)){
			// Check if got alerts within last minute
			if ((time.getTime() - theCache[pos][1]) > 60*1000){
				addLoadingKey("nws-alerts" + pos);
				JSONGetAsync("https://api.weather.gov/alerts/active?point=" + pos, (res) =>{
					removeLoadingKey("nws-alerts" + pos);
				try{
					theCache[pos] = [res["features"], time.getTime()]
					localStorage.setItem("nws-alerts-cache", JSON.stringify(theCache));
					syncFiles();
					addToActiveAlertsCheck(theCache[pos]);
					if (extraReturn != null){
						nomCallback(theCache[pos], extraReturn);
					}
					else{
						nomCallback(theCache[pos]);
					}
				}
				catch(err){
					console.log(err);
					if (extraReturn != null){
						nomCallback(false, extraReturn);
					}
					else{
						nomCallback(false);
					}
				}
			});
			}
			else{
				if (extraReturn != null){
					nomCallback(theCache[pos], extraReturn);
				}
				else{
					nomCallback(theCache[pos]);
				}
			}
		}
		else{
			addLoadingKey("nws-alerts" + pos);
			JSONGetAsync("https://api.weather.gov/alerts/active?point=" + pos, (res) =>{
				removeLoadingKey("nws-alerts" + pos);
				try{
					theCache[pos] = [res["features"], time.getTime()]
					localStorage.setItem("nws-alerts-cache", JSON.stringify(theCache));
					syncFiles();
					addToActiveAlertsCheck(theCache[pos]);
					if (extraReturn != null){
						nomCallback(theCache[pos], extraReturn);
					}
					else{
						nomCallback(theCache[pos]);
					}
				}
				catch(err){
					console.log(err);
					if (extraReturn != null){
						nomCallback(false, extraReturn);
					}
					else{
						nomCallback(false);
					}
				}
			});
		}
	}
	catch(err){
		console.log(err);
		if (extraReturn != null){
			nomCallback(false, extraReturn);
		}
		else{
			nomCallback(false);
		}
	}
}

/**
 * Checks if weather alerts should be added to the active alerts.
 *
 * @param {Array} alerts - An array of weather alerts to check.
 */
function addToActiveAlertsCheck(alerts){
	let theCache = JSON.parse(localStorage.getItem("nws-alerts-current"));
	let a = 0;
	while (a < alerts.length){
		if (!theCache.includes(alerts[a][0])){
			theCache.push(alerts[a][0]);
		}
		a++;
	}
	localStorage.setItem("nws-alerts-current", JSON.stringify(theCache))
	syncFiles();
}

/**
 * Checks if weather alerts should be moved from current to old.
 *
 * @param {boolean} [runFunction=false] - Whether to run a function after checking alerts.
 * @param {Function} [functionToRun=null] - The function to run after checking alerts.
 */
function checkIfOldAlerts(runFunction=false, functionToRun=null){
	let nomLocations = JSON.parse(localStorage.getItem("weather-locations"));
	let a = 0;
	let allCurrent = [];
	let cacheCurrent = JSON.parse(localStorage.getItem("nws-alerts-current"));
	let moveToOld = [];
	let locationsChecked = 0;
	while (a < nomLocations.length){
		getWeatherAlertsForNomAsync(nomLocations[a], (res, a) => {
			allCurrent = allCurrent.concat(res[0]);
			if (a === nomLocations.length - 1){
				a = 0;
				let ids = [];
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
				let oldAlerts = JSON.parse(localStorage.getItem("nws-alerts-old"))
				oldAlerts = oldAlerts.concat(moveToOld);
				oldAlerts = oldAlerts.slice(-20);
				localStorage.setItem("nws-alerts-old", JSON.stringify(oldAlerts));
				syncFiles();
			}
			locationsChecked++;
		}, a);
		a++;
	}
	if (runFunction){
		let interval = setInterval(() => {
			if (locationsChecked === nomLocations.length){
				clearInterval(interval);
				if (functionToRun){
					functionToRun();
				}
			}

		}, 100);
	}
}

/**
 * Gets the polygon boundary of weather alerts.
 *
 * @param {Object} weatherAlert - The weather alert object containing affected zones.
 * @param {Function} callback - The callback function to handle the polygon boundaries.
 * @param {any} [extraReturn=null] - Additional data to return with the callback.
 */
function getPolyBoundariesAsync(weatherAlert, callback, extraReturn=null){
	if (weatherAlert["geometry"] == null){
		let theCache = JSON.parse(localStorage.getItem("nws-boundaries-cache"));
		let forecastZone;
		let a = 0;
		let zonesGeo = []
		let theBoundaries;
		let called = 0;
		let calledDone = 0;
		while (a < weatherAlert["properties"]["affectedZones"].length){
			forecastZone = weatherAlert["properties"]["affectedZones"][a];
			getForecastZonePolyAsync(forecastZone, (theBoundaries, a) =>{
				if (theBoundaries == false){
					missed.push(forecastZone);
					called++;
					JSONGetAsync(forecastZone, (theBoundaries) => {
						zonesGeo.push(theBoundaries);
						theCache[forecastZone] = theBoundaries;
						calledDone++;
						if (calledDone == called){
							if (extraReturn != null){
								callback(zonesGeo, extraReturn);
							}
							else{
								callback(zonesGeo);
							}
						}
					});
				}
				else{
					zonesGeo.push(theBoundaries);
					theCache[forecastZone] = theBoundaries;
				}
			}, a);
			a++;
		}
		if (called == 0){
			if (extraReturn != null){
				callback(zonesGeo, extraReturn);
			}
			else{
				callback(zonesGeo);
			}
		}
	}
	else{
		if (extraReturn != null){
			callback([weatherAlert], extraReturn);
		}
		else{
			callback([weatherAlert]);
		}
	}
}

/**
 * Fetches all active weather alerts asynchronously.
 *
 * @param {Function} callback - The callback function to handle the active weather alerts.
 */
function getAllActiveAlertsAsync(callback){
	try{
		let pos = "9999,9999";
		let theCache = JSON.parse(localStorage.getItem("nws-alerts-cache"));
		let time = new Date();
		if (theCache.hasOwnProperty(pos)){
			// Check if got alerts within the last minute
			if ((time.getTime() - theCache[pos][1]) > 60*1000){
				JSONGetAsync("https://api.weather.gov/alerts/active", (res) => {
					theCache[pos] = [res["features"], time.getTime()]
					localStorage.setItem("nws-alerts-cache", JSON.stringify(theCache));
					callback(theCache[pos]);
				});
			}
			else{
				callback(theCache[pos]);
			}
		}
		else{
			JSONGetAsync("https://api.weather.gov/alerts/active", (res) => {
					theCache[pos] = [res["features"], time.getTime()]
					localStorage.setItem("nws-alerts-cache", JSON.stringify(theCache));
					callback(theCache[pos]);
			});
		}
		syncFiles();
	}
	catch(err){
		console.log("Error");
		console.log(err);
		callback(false);
	}
}

/**
 * Gets the polygon boundary for a forecast zone asynchronously.
 *
 * @param {string} forecastZone - The forecast zone identifier.
 * @param {Function} callback - The callback function to handle the polygon boundary data.
 * @param {any} [extraReturn=null] - Additional data to return with the callback.
 */
function getForecastZonePolyAsync(forecastZone, callback, extraReturn=null){
	let allSettings = JSON.parse(localStorage.getItem("atmos-settings"));
	let areaData;
	if (forecastZone.includes("fire")){
		getFireZonePolyAsync(forecastZone, (res) => {
			if (extraReturn != null){
				callback(res, extraReturn);
			}
			else{
				callback(res);
			}
		})
		return;
	}
	else if (forecastZone.includes("county")){
		getCountyPolyAsync(forecastZone, (res) => {
			if (extraReturn != null){
				callback(res, extraReturn);
			}
			else{
				callback(res);
			}
		})
		return;
	}
	let zoneCode = forecastZone.substring(39);
	let zoneNum = Number(zoneCode.substring(3));
	let zoneId = zoneCode.substring(0,2);
	let eo = "odd";
	if (zoneNum % 2 === 0){
		eo = "even"
	}
	if (allSettings["radar"]["polygons"]["high-res"]){
		eo += "-highres";
	}
	let fullCode = zoneId + "-" + eo;
	if (fullCode in tempPolyCache){
		areaData = tempPolyCache[fullCode];
		if (zoneCode in areaData){
			if (extraReturn != null){
				callback(areaData[zoneCode], extraReturn);
			}
			else{
				callback(areaData[zoneCode]);
			}
		}
		else{
			if (extraReturn != null){
				callback(false, extraReturn);
			}
			else{
				callback(false);
			}
		}
	}
	else{
		try{
			JSONGetAsync("https://atticuscornett.github.io/AtmosWeather/data/geometry/forecastZones/" + zoneId + "-" + eo + ".json", (areaData) => {
				try{
					tempPolyCache[fullCode] = areaData;
				}
				catch(err){
					areaData = {};
				}
				if (zoneCode in areaData){
					if (extraReturn != null){
						callback(areaData[zoneCode], extraReturn);
					}
					else{
						callback(areaData[zoneCode]);
					}
				}
				else{
					if (extraReturn != null){
						callback(false, extraReturn);
					}
					else{
						callback(false);
					}
				}
			});
			
		}
		catch(err){
			if (extraReturn != null){
				callback(false, extraReturn);
			}
			else{
				callback(false);
			}
		}
	}
}

/**
 * Gets the polygon boundary for a fire forecast zone asynchronously.
 *
 * @param {string} forecastZone - The forecast zone identifier.
 * @param {Function} callback - The callback function to handle the polygon boundary data.
 * @param {any} [extraReturn=null] - Additional data to return with the callback.
 */
function getFireZonePolyAsync(forecastZone, callback, extraReturn=null){
	let allSettings = JSON.parse(localStorage.getItem("atmos-settings"));
	let zoneCode = forecastZone.substring(35);
	let zoneNum = Number(zoneCode.substring(3));
	let zoneId = zoneCode.substring(0,2);
	let eo = "odd";
	let areaData;
	if (zoneNum % 2 === 0){
		eo = "even"
	}
	if (allSettings["radar"]["polygons"]["high-res"]){
		eo += "-highres";
	}
	let fullCode = zoneId + "-" + eo;
	if (fullCode in tempPolyFireCache){
		areaData = tempPolyFireCache[fullCode];
		if (zoneCode in areaData){
			if (extraReturn != null){
				callback(areaData[zoneCode], extraReturn);
			}
			else{
				callback(areaData[zoneCode]);
			}
			
		}
		else{
			if (extraReturn != null){
				callback(false, extraReturn);
			}
			else{
				callback(false);
			}
		}
	}
	else{
		try{
			JSONGetAsync("https://atticuscornett.github.io/AtmosWeather/data/geometry/fireZones/" + zoneId + "-" + eo + ".json", (areaData) => {
				try{
					tempPolyFireCache[fullCode] = areaData;
				}
				catch(err){
					areaData = {};
				}
				if (zoneCode in areaData){
					if (extraReturn != null){
						callback(areaData[zoneCode], extraReturn);
					}
					else{
						callback(areaData[zoneCode]);
					}
					
				}
				else{
					if (extraReturn != null){
						callback(false, extraReturn);
					}
					else{
						callback(false);
					}
				}
			})
			
		}
		catch(err){
			areaData = {};
		}
	}
}

/**
 * Gets the polygon boundary for a county forecast zone asynchronously.
 *
 * @param {string} forecastZone - The forecast zone identifier.
 * @param {Function} callback - The callback function to handle the polygon boundary data.
 * @param {any} [extraReturn=null] - Additional data to return with the callback.
 */
function getCountyPolyAsync(forecastZone, callback, extraReturn=null){
	let allSettings = JSON.parse(localStorage.getItem("atmos-settings"));
	let zoneCode = forecastZone.substring(37);
	let zoneNum = Number(zoneCode.substring(3));
	let zoneId = zoneCode.substring(0,2);
	let eo = "";
	if (allSettings["radar"]["polygons"]["high-res"]){
		eo = "-highres";
	}
	let fullCode = zoneId + eo;
	let areaData;
	if (fullCode in tempPolyCountyCache){
		areaData = tempPolyCountyCache[fullCode];
		if (zoneCode in areaData){
			if (extraReturn != null){
				callback(areaData[zoneCode], extraReturn);
			}
			else{
				callback(areaData[zoneCode]);
			}
			
		}
		else{
			if (extraReturn != null){
				callback(false, extraReturn);
			}
			else{
				callback(false);
			}
		}
	}
	else{
		try{
			JSONGetAsync("https://atticuscornett.github.io/AtmosWeather/data/geometry/countyZones/" + zoneId + eo + ".json", (areaData) => {
				try{
					tempPolyCountyCache[fullCode] = areaData;
				}
				catch(err){
					areaData = {};
				}
				if (zoneCode in areaData){
					if (extraReturn != null){
						callback(areaData[zoneCode], extraReturn);
					}
					else{
						callback(areaData[zoneCode]);
					}
					
				}
				else{
					if (extraReturn != null){
						callback(false, extraReturn);
					}
					else{
						callback(false);
					}
				}
			})
			
		}
		catch(err){
			areaData = {};
		}
	}
}

/**
 * Sorts a list of weather alerts by event type for radar display.
 *
 * @param {Array} alertsList - The list of weather alerts to be sorted.
 * @returns {Array} The sorted list of weather alerts.
 */
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