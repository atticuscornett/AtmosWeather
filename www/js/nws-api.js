/*
	nws-api.js
	Handles the caching and fetching of forecasts, alerts, and other information from the National Weather Service API
*/

// Keep downloaded polygons until page reload.
var tempPolyCache = {};
var tempPolyFireCache = {}
var tempPolyCountyCache = {}
var missed = [];

// Set up empty storage
if (!localStorage.getItem("nws-location-cache")){
	localStorage.setItem("nws-location-cache", "{}");
	localStorage.setItem("nws-forecast-cache", "{}");
	localStorage.setItem("nws-hourly-forecast-cache", "{}");
	localStorage.setItem("nws-alerts-cache", "{}");
	localStorage.setItem("nws-alerts-old", "[]");
	localStorage.setItem("nws-alerts-current", "[]");	
}
if (!localStorage.setItem("nws-boundaries-cache", "{}")){
	localStorage.setItem("nws-boundaries-cache", "{}");
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
			window.loadingElements++;
			httpGetAsync(hourlyForecastLink, (hourlyForecast)=>{
				window.loadingElements--;
				try{
					hourlyForecast = JSON.parse(hourlyForecast);
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

// Get full forecast information
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
			window.loadingElements++;
			JSONGetAsync(forecastLink, (forecast) => {
				window.loadingElements--;
				try{
					forecast = forecast["properties"]["periods"];
					theCache[weatherGrid[1]] = [forecast, time.getTime()];
					localStorage.setItem("nws-forecast-cache", JSON.stringify(theCache));
					document.getElementById("offlineError").hidden = true;
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

// // Get hourly for current location (requires prior successful run of getCurrentLocation [atmos-ui.js])
// function getHourlyGeoAsync(callback, extraReturn=null){
// 	if (!currentLat){
// 		if (extraReturn != null){
// 			callback(false, extraReturn);
// 		}
// 		else{
// 			callback(false);
// 		}
// 	}
// 	JSONGetAsync("https://api.weather.gov/points/" + currentLat.toString() + "," + currentLong.toString(), (weatherAlert) => {
// 		var hourlyForecastLink = weatherGrid["properties"]["forecastHourly"]
// 		JSONGetAsync(hourlyForecastLink, (hourlyForecast) => {
// 			hourlyForecast = hourlyForecast["properties"]["periods"];
// 			if (extraReturn != null){
// 				callback(hourlyForecast, extraReturn);
// 			}
// 			else{
// 				callback(hourlyForecast);
// 			}
// 		})
// 	});
// }


// // Get full forecast of current location (requires prior successful run of getCurrentLocation [atmos-ui.js])
// function getForecastGeo(){
// 	if (!currentLat){
// 		return false;
// 	}
// 	var weatherGrid = JSONGet("https://api.weather.gov/points/" + currentLat.toString() + "," + currentLong.toString());
// 	var forecastLink = weatherGrid["properties"]["forecast"]
// 	var forecast = JSON.parse(httpGet(forecastLink));
// 	forecast = forecast["properties"]["periods"];
// 	return forecast;
// }

// Gets active weather alerts for a location

function getWeatherAlertsForPosAsync(lat, long, callback, extraReturn=null){
	var theCache = JSON.parse(localStorage.getItem("nws-location-cache"));
	try{
		window.loadingElements++;
		JSONGetAsync("https://api.weather.gov/alerts/active?point=" + lat.toString() + "," + long.toString(), (theAlerts) =>{
			window.loadingElements--;
			theAlerts = theAlerts["features"];
			if (extraReturn != null){
				callback(theAlerts, extraReturn);
			}
			else{
				callback(theAlerts);
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

// Gets active weather alerts for a nominatim object
function getWeatherAlertsForNomAsync(nomObj, nomCallback, extraReturn=null){
	try{
		var pos = nomObj["lat"].toString() + "," + nomObj["lon"].toString();
		var theCache = JSON.parse(localStorage.getItem("nws-alerts-cache"));
		var time = new Date();
		if (theCache.hasOwnProperty(pos)){
			// Check if got alerts within last minute
			if ((time.getTime() - theCache[pos][1]) > 60*1000){
				window.loadingElements++;
				JSONGetAsync("https://api.weather.gov/alerts/active?point=" + pos, (res) =>{
					window.loadingElements--;
				try{
					theCache[pos] = [res["features"], time.getTime()]
					localStorage.setItem("nws-alerts-cache", JSON.stringify(theCache));
					addToActiveAlertsCheck(theCache[pos]);
					if (extraReturn != null){
						nomCallback(theCache[pos], extraReturn);
					}
					else{
						nomCallback(theCache[pos]);
					}
				}
				catch(err){
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
			window.loadingElements++;
			JSONGetAsync("https://api.weather.gov/alerts/active?point=" + pos, (res) =>{
				window.loadingElements--;
				try{
					theCache[pos] = [res["features"], time.getTime()]
					localStorage.setItem("nws-alerts-cache", JSON.stringify(theCache));
					addToActiveAlertsCheck(theCache[pos]);
					if (extraReturn != null){
						nomCallback(theCache[pos], extraReturn);
					}
					else{
						nomCallback(theCache[pos]);
					}
				}
				catch(err){
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
		if (extraReturn != null){
			nomCallback(false, extraReturn);
		}
		else{
			nomCallback(false);
		}
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
function checkIfOldAlerts(runFunction=false, functionToRun=null){
	var nomLocations = JSON.parse(localStorage.getItem("weather-locations"));
	var a = 0;
	var allCurrent = [];
	var cacheCurrent = JSON.parse(localStorage.getItem("nws-alerts-current"));
	var moveToOld = [];
	while (a < nomLocations.length){
		getWeatherAlertsForNomAsync(nomLocations[a], (res, a) => {
			allCurrent = allCurrent.concat(res[0]);
			if (a == nomLocations.length - 1){
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
		}, a);
		a++;
	}
	if (runFunction){
		functionToRun();
	}
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
function getPolyBoundariesAsync(weatherAlert, callback, extraReturn=null){
	if (weatherAlert["geometry"] == null){
		var theCache = JSON.parse(localStorage.getItem("nws-boundaries-cache"));
		var forecastZone;
		var a = 0;
		var zonesGeo = []
		var theBoundaries;
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

// Gets all active weather alerts
function getAllActiveAlertsAsync(callback){
	try{
		var pos = "9999,9999";
		var theCache = JSON.parse(localStorage.getItem("nws-alerts-cache"));
		var time = new Date();
		if (theCache.hasOwnProperty(pos)){
			// Check if got alerts within last minute
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
	}
	catch(err){
		console.log("Error");
		console.log(err);
		callback(false);
	}
}

// Get polygon for forecast zone
function getForecastZonePolyAsync(forecastZone, callback, extraReturn=null){
	let allSettings = JSON.parse(localStorage.getItem("atmos-settings"));
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

// Get polygon for fire forecast zone
function getFireZonePolyAsync(forecastZone, callback, extraReturn=null){
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
		if (zoneCode in areaData){
			if (callback != null){
				callback(areaData[zoneCode], extraReturn);
			}
			else{
				callback(areaData[zoneCode]);
			}
			
		}
		else{
			if (callback != null){
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
					if (callback != null){
						callback(areaData[zoneCode], extraReturn);
					}
					else{
						callback(areaData[zoneCode]);
					}
					
				}
				else{
					if (callback != null){
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

// Get polygon for fire forecast zone
function getCountyPolyAsync(forecastZone, callback, extraReturn=null){
	let allSettings = JSON.parse(localStorage.getItem("atmos-settings"));
	var zoneCode = forecastZone.substring(37);
	var zoneNum = Number(zoneCode.substring(3));
	var zoneId = zoneCode.substring(0,2);
	var eo = "";
	if (allSettings["radar"]["polygons"]["high-res"]){
		eo = "-highres";
	}
	var fullCode = zoneId + eo;
	if (fullCode in tempPolyCountyCache){
		areaData = tempPolyCountyCache[fullCode];
		if (zoneCode in areaData){
			if (callback != null){
				callback(areaData[zoneCode], extraReturn);
			}
			else{
				callback(areaData[zoneCode]);
			}
			
		}
		else{
			if (callback != null){
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
					if (callback != null){
						callback(areaData[zoneCode], extraReturn);
					}
					else{
						callback(areaData[zoneCode]);
					}
					
				}
				else{
					if (callback != null){
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