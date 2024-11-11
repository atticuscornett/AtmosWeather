/*
	atmos-ui.js
	Handles most user interface related Javascript
	Also functions as a miscellaneous function file
*/

console.log("🌥⚡ Atmos Weather")

// Initialize Capacitor
navigator.geolocation.getCurrentPosition(function(position){
	window.currentLat = position.coords.latitude;
	window.currentLong = position.coords.longitude;
});
cap.getDevice();

// Initial Variable States
var screenAt = "locations";
var cordovaReady = true;
var currentLat = false;
var currentLong = false;
var locationEnabled = true;
var lastLocationCheck = 0;
var lastLocationInfo;

// Hides the notice screen on button press
// Initialize Leaflet Maps
var map = L.map('alert-map').setView([33.543682, -86.8104], 13);
var map2 = L.map('radar-map').setView([40.58207622, -95.461760283], 3);
map.on("load", function(){})
var polygon = false;
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    	maxZoom: 19,
    	attribution: '© OpenStreetMap'
	}).addTo(map);
// Decides if there are any notices to show, and if so, creates them and shows them

// Check the version of Atmos being run
function getPlatform(){
	var platform = "unknown"
	if (window.deviceInfo.platform == "web"){
		// Running either electron version or online version
		if (navigator.userAgent.includes("Electron")){
			if (navigator.platform.indexOf("Win") == 0){
				platform = "desktop-windows"
			}
			else if (navigator.platform.indexOf("Mac") == 0){
				platform = "desktop-mac"
			}
			else{
				platform = "desktop-linux"
			}
		}
		else{
			platform = "pwa";
		}
	}
	else{
		if (window.deviceInfo.platform == "electron"){
			if (navigator.platform.indexOf("Win") == 0){
				platform = "desktop-windows"
			}
			else if (navigator.platform.indexOf("Mac") == 0){
				platform = "desktop-mac"
			}
			else{
				platform = "desktop-linux"
			}
		}
		else{
			platform = window.deviceInfo.platform;
		}
	}
	window.platform = platform;
	return platform;
}

// Navigate to another screen
function navTo(screenTo){
	let atmosSettings = JSON.parse(localStorage.getItem("atmos-settings"));
	if (!atmosSettings["personalization"]){
		atmosSettings["personalization"] = {};
	}
	if (!atmosSettings["personalization"]["page-transition"]){
		atmosSettings["personalization"]["page-transition"] = 1500;
	}
	let duration = atmosSettings["personalization"]["page-transition-duration"] + "ms";
	let delay = atmosSettings["personalization"]["page-transition-duration"]/4;
	document.getElementById("tab-" + screenAt).setAttribute("style", "animation: offLeft " + duration + ";")
	setTimeout(function(){
		document.getElementById("tab-" + screenAt).setAttribute("style", "")
		document.getElementById("tab-" + screenAt).hidden = true;
		navCode(screenTo);
		document.getElementById("tab-" + screenTo).setAttribute("style", "animation: onRight " + duration + ";");
		document.getElementById("tab-" + screenTo).hidden = false;
		screenAt = screenTo;
	}, delay);
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

// Add the selected location to the database


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
			document.getElementById("location-main").innerHTML = '<div class="location ' + "currentloc" + '" id="currentLocDiv"><div style="display: inline-block;height: inherit;vertical-align: top;margin-top:35px;"><img style="vertical-align:center;" src="img/' + "current-location" + '.svg"></div><div style="display:inline-block;margin-left:8px;margin-right:8px;"><h2 id="currentLocTitle">' + "Current Location" + '</h2><h3 id="currentLocData">Loading information...</h3></div></div><br>';
		}
		else{
			document.getElementById("location-main").innerHTML = "";
		}
		document.getElementById("location-w-alert").innerHTML = "";
		document.getElementById("location-w-other").innerHTML = "";
		document.getElementById("location-data").innerHTML = "";
		var a = 0;
		while (a < nomLocations.length){
			nomToWeatherGridAsync(nomLocations[a], (nomRes, a) => {
				getHourlyForecastAsync(nomRes, (hourly) => {
					getStatusAsync(nomLocations[a], (fullStatus) => {
						var alertStatus = fullStatus[0];
						var image = "sunny";
						if (!hourly[0]){
							if (!refreshAgain){
								refreshAgain = true;
								setTimeout(refreshLocations, 7000);
							}
							var theDiv = '<div class="location ' + "error" + '"><div style="display: inline-block;height: inherit;vertical-align: top;margin-top:35px;"><img style="vertical-align:center;animation: loadAnim infinite 2s;" src="img/' + "error" + '.svg"></div><div style="display:inline-block;margin-left:8px;margin-right:8px;"><h2>' + nomLocationNames[a] + '</h2><h3>Loading location data...</h3></div></div><br>';
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
							else if (sfor.includes("cloud") || sfor.includes("fog")){
								image = "cloudy";
							}
							if (alertStatus == "warning"){
								image = "warning";
								info = fullStatus[1].toString() + " warning(s) and " + fullStatus[2].toString() + " watch(es)";
							}
							if (alertStatus == "watch"){
								info = fullStatus[2].toString() + " watch(es)";
							}
							if (alertStatus == "other"){
								info = "Weather statements in effect";
							}
							var theDiv = '<div class="location ' + alertStatus + '" onclick="navTo(\'locdat-' + nomLocationNames[a] + '-' + a.toString() + '\')"><div style="display: inline-block;height: inherit;vertical-align: top;margin-top:35px;"><img style="vertical-align:center;" src="img/' + image + '.svg"></div><div style="display:inline-block;margin-left:8px;margin-right:8px;"><h2>' + nomLocationNames[a] + '</h2><h3 style="margin-right:8px;">' + info + '&emsp;(Tap for more info.)</h3></div></div><br>';
							if (alertStatus == "warning"){
								document.getElementById("location-w-alert").innerHTML += theDiv;
							}
							else if (alertStatus == "watch" || alertStatus == "other"){
								document.getElementById("location-w-other").innerHTML += theDiv;
							}
							else{
								document.getElementById("location-main").innerHTML += theDiv;
							}
							document.getElementById("location-data").innerHTML += "<div id='tab-locdat-" + nomLocationNames[a] + '-' + a.toString() + "' class='tab-div' hidden><h1>" + nomLocationNames[a] + "</h1></div>";
						}
					});
				});
			}, a);
			a++;
		}
	}
	else{
		document.getElementById("location-w-alert").innerHTML = "";
		document.getElementById("location-w-other").innerHTML = "";
		document.getElementById("location-data").innerHTML = "";
		if (locationEnabled){
			document.getElementById("location-main").innerHTML = '<div class="location ' + "currentloc" + '" id="currentLocDiv"><div style="display: inline-block;height: inherit;vertical-align: top;margin-top:35px;"><img style="vertical-align:center;" src="img/' + "current-location" + '.svg"></div><div style="display:inline-block;margin-left:8px;margin-right:8px;"><h2 h2 id="currentLocTitle">' + "Current Location" + '</h2><h3 id="currentLocData">Loading information...</h3></div></div><br>';
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
			setTimeout(loadRadarData, 1000);
			setTimeout(playRadarAnimation, 5000);
			var polygon;
			setTimeout(function(){
				getAllActiveAlertsAsync(
					(alerts) => {
						alerts = sortByEventType(alerts);
						slowLoadPolygons(alerts, 0);
					}
				);
			}, 5000)
		}, 2000);
	}
	if (screenTo == "settings"){
		refreshSettings();
		//setTimeout(keepSaving, 10);
	}
	if (screenAt == "settings"){
		saveSettings();
	}
}

// Load more information about a location
function loadMoreInfo(navName){
	var index = navName.split("-");
	index = parseInt(index[index.length -1]);
	var nomObj = JSON.parse(localStorage.getItem("weather-locations"))[index];
	var nomName = JSON.parse(localStorage.getItem("weather-location-names"))[index];
	nomToWeatherGridAsync(nomObj, (wGrid) => {
		getForecastAsync(wGrid, (forecast) => {
			getHourlyForecastAsync(wGrid, (hourly) =>{
				getAdditionalWeatherDataForNomAsync(nomObj, (additionalData) => {
					var image = "sunny"
					var sfor = hourly[0][0]["shortForecast"].toLowerCase();
					if (sfor.includes("rain") || sfor.includes("drizzle")){
						image = "rainy";
					}
					else if (sfor.includes("tornado") || sfor.includes("storm") || sfor.includes("water spout")){
						image = "stormy";
					}
					else if (sfor.includes("snow")){
						image = "snowy";
					}
					else if (sfor.includes("wind")){
						image = "windy";
					}
					else if (sfor.includes("cloud") || sfor.includes("fog")){
						image = "cloudy";
					}
					var generatedCode;
					getWeatherAlertsForNomAsync(nomObj, (activeAlertInfo) => {
						activeAlertInfo = activeAlertInfo[0];
						getStatusAsync(nomObj, (fullStatus) => {
							getCurrentAQIForNomAsync(nomObj, (AQI) => {
								window.loadingElements++;
								generatedCode = "<h1>" + nomName + "</h1><br>";
								// Bars at the top of page
								generatedCode += '<div>'
								// Temperature Bar
								let longHourForecast = "<h1>Hourly Forecast</h1>";
								try{

									clearCharts(index);
									longHourForecast += "<div class='weatherGraph' id='" + String(index) + "-loc-hourly-feels-like-chart-container' style='display:none;'><canvas id='" + String(index) + "-loc-hourly-feels-like-chart'></canvas></div>";
									longHourForecast += "<div class='weatherGraph' id='" + String(index) + "-loc-hourly-precip-chart-container' style='display:none;'><canvas id='" + String(index) + "-loc-hourly-precip-chart'></canvas></div>";
									longHourForecast += "<div class='weatherGraph' id='" + String(index) + "-loc-hourly-humid-chart-container' style='display:none;'><canvas id='" + String(index) + "-loc-hourly-humid-chart'></canvas></div>";
									longHourForecast += "<div class='weatherGraph' id='" + String(index) + "-loc-hourly-wind-chart-container' style='display:none;'><canvas id='" + String(index) + "-loc-hourly-wind-chart'></canvas></div>";
									longHourForecast += "<div class='weatherGraph' id='" + String(index) + "-loc-hourly-dewpoint-chart-container' style='display:none;'><canvas id='" + String(index) + "-loc-hourly-dewpoint-chart'></canvas></div>";
									longHourForecast += "<h6>Feels Like temperature is provided by <a href='https://open-meteo.com/' target='_blank'>Open-Meteo</a></h6>";
									let feelsLike = removeOldData(additionalData["hourly"]["time"], additionalData["hourly"]["apparent_temperature"]);

									// Wait for the DOM to be updated before making graphs
									setTimeout(function(){
										makeTempGraph(index, hourly[0]);
										makePrecipGraph(index, hourly[0]);
										makeHumidGraph(index, hourly[0]);
										makeWindGraph(index, hourly[0]);
										makeDewpointGraph(index, hourly[0]);
										makeFeelsLikeGraph(index, feelsLike);
										document.getElementById(String(index)+"-loc-hourly-select").onchange = switchGraphs;
										window.loadingElements = 0;
									}, 50);
								}
								catch (e){
									longHourForecast = "<h2>There is no currently available short forecast for this location. This may be due to extreme hazardous conditions or NWS API errors.";
									console.log(e)
									window.loadingElements = 0;
								}

								generatedCode += longHourForecast;
								// Add detailed forecast at bottom
								var extendedForecast = "<br><h1>NWS Forecast</h1><br>";
								try{
									for (let i of forecast[0]){
										extendedForecast += "<details><summary>" + i["name"] + "</summary>" + i["detailedForecast"] + "</details>";
									}
								}
								catch(err){
									extendedForecast = "<h3>Loading location forecast...</h3>";
									setTimeout(function(){
										if (screenAt.includes("locdat")){
											loadMoreInfo(navName);
										}
									}, 7000)
								}
								generatedCode += extendedForecast;
								generatedCode += "<button style='width:100%;cursor:pointer;background-color:darkslategray;color:white;border:none;border-radius:7px;font-size:20px;font-family:Secular One;' onclick='removeLocation(" + index.toString() + ");'>Remove This Location</button>"
								document.getElementById("tab-" + navName).innerHTML = generatedCode + "</div>";
							});
						});
					});
				})
			});
		});
	});
}

// Check if a location is under any watches, warnings, etc.


// Sync with native code
function syncFiles(){
	if (!getPlatform().includes("desktop") && !getPlatform().includes("pwa")){
		cap.syncPreferences();
	}
}

// Removes a location from the list observed
function removeLocation(index){
	var theCache = JSON.parse(localStorage.getItem("weather-locations"));
	var theOtherCache = JSON.parse(localStorage.getItem("weather-location-names"));
	let name = theOtherCache[index];
	let locDiv = document.getElementById("tab-locdat-"+name+"-"+index.toString());
	// Disable the remove location button to prevent accidental double taps causing multiple locations to be removed.
	locDiv.getElementsByTagName("button")[0].onclick = ()=>{};
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
					JSONGetAsync("https://api.weather.gov/points/" + currentLat.toString() + "," + currentLong.toString(), 
							(weatherGrid) => {
							try{
								var hourlyForecastLink = weatherGrid["properties"]["forecastHourly"]
								JSONGetAsync(hourlyForecastLink,
									(hourlyForecast) => {
										try{
											var hourly = [hourlyForecast["properties"]["periods"]];
											JSONGetAsync(weatherGrid["properties"]["forecast"], (jsonReturn) =>{
												try{
													var forecast = [jsonReturn["properties"]["periods"]];
													hourlyForecast = hourlyForecast["properties"]["periods"][0];
													var info = hourlyForecast["temperature"] + " F - " + hourlyForecast["shortForecast"];
													document.getElementById("currentLocData").innerHTML = info;
													document.getElementById("currentLocTitle").innerHTML = "Current Location (" + currentLat.toString() + ", " + currentLong.toString() + ")";
													getWeatherAlertsForPosAsync(currentLat, currentLong, (weatherAlerts) => {
														getAdditionalWeatherDataForPositionAsync(currentLat, currentLong, (additionalData) => {
															var status = getStatusForPos(weatherAlerts);
															if (status[0] == "noalerts"){
																document.getElementById("currentLocDiv").setAttribute("class", "location currentloc");
															}
															else{
																document.getElementById("currentLocDiv").setAttribute("class", "location " + status[0]);
															}
															var theWarnings = "";
															var generatedCode = "";
															var b = 0;
															while (b < weatherAlerts.length){
																theWarnings += "<a href='#' onclick='loadAlertForCurrent(" + String(b) + ")' style='color:white;'>" + weatherAlerts[b]["properties"]["event"] + "</a>&emsp;"
																b++;
															}
															theWarnings += " (Tap for more info.)";
															if (status[0] == "warning"){
																generatedCode += '<div class="location ' + status[0] + '"><div style="display: inline-block;height: inherit;vertical-align: top;margin-top:20px;"><img style="vertical-align:center;" src="img/warning.svg"></div><div style="display:inline-block;margin-left:8px;margin-right: 8px;"><h1>This location has active warnings!</h1><h3 style="margin-right:8px;">' + theWarnings + '</h3></div></div><br>';
															}
															if (status[0] == "watch"){
																generatedCode += '<div class="location ' + status[0] + '"><div style="display: inline-block;height: inherit;vertical-align: top;margin-top:20px;"><img style="vertical-align:center;" src="img/watch.svg"></div><div style="display:inline-block;margin-left:8px;margin-right: 8px;"><h1>This location has active watches.</h1><h3 style="margin-right:8px;">' + theWarnings + '</h3></div></div><br>';
															}
															if (status[0] == "other"){
																theWarnings = theWarnings.replaceAll(",", ", ")
																generatedCode += '<div class="location ' + status[0] + '"><div style="display: inline-block;height: inherit;vertical-align: top;margin-top:20px;"><img style="vertical-align:center;" src="img/watch.svg"></div><div style="display:inline-block;margin-left:8px;margin-right: 8px;"><h1>This location has active weather statements.</h1><h3 style="margin-right:8px;">' + theWarnings + '</h3></div></div><br>';
															}
															if (generatedCode == ""){
																document.getElementById("current-loc-alerts").hidden = true;
															}
															else{
																document.getElementById("current-loc-alerts").hidden = false;
															}
															document.getElementById("current-loc-alerts").innerHTML = generatedCode;
															document.getElementById("current-loc-main-info").setAttribute("class", "location noclick " + status[0]);
															document.getElementById("current-loc-temp").innerHTML = hourlyForecast["temperature"] + "° F";
															document.getElementById("current-loc-feels-like").innerHTML = "Feels like " + Math.round(additionalData["current"]["apparent_temperature"]) + "° F";
															document.getElementById("current-loc-desc").innerHTML = hourlyForecast["shortForecast"];
															document.getElementById("currentLocDiv").setAttribute("onclick", "navTo('current-location-data')");

															let feelsLike = removeOldData(additionalData["hourly"]["time"], additionalData["hourly"]["apparent_temperature"]);

															Chart.defaults.font.size = 18;
															Chart.defaults.font.family = "Secular One";
															clearCharts("current");
															// Create hourly temp chart
															makeTempGraph("current", hourly[0]);
															// Create hourly precipitation chart
															makePrecipGraph("current", hourly[0]);
															// Create hourly humidity chart
															makeHumidGraph("current", hourly[0]);
															// Create hourly wind chart
															makeWindGraph("current", hourly[0]);
															// Create hourly dewpoint chart
															makeDewpointGraph("current", hourly[0]);
															// Create hourly feels like chart
															makeFeelsLikeGraph("current", feelsLike);
															var extendedForecast = "";
															for (let i of forecast[0]){
																extendedForecast += "<details><summary>" + i["name"] + "</summary>" + i["detailedForecast"] + "</details>";
															}
															document.getElementById("current-loc-nws").innerHTML = extendedForecast;
															var theTime = new Date();
															lastLocationCheck = theTime.getTime();
															lastLocationInfo = info;
															getCurrentAQIForPositionAsync(currentLat.toString(), currentLong.toString(), (AQI) => {
																document.getElementById("current-loc-aqi").innerHTML = AQI.toString() + " (" + getAQICategory(AQI) + ")";
																let gauge = makeGauge(AQI, 0, 300);
																document.getElementById("current-loc-aqi-bar").firstChild.remove();
																document.getElementById("current-loc-aqi-bar").appendChild(gauge);
															});
														});
													});
													}
													catch(err){
														document.getElementById("currentLocData").innerHTML = "Loading...";
														document.getElementById("currentLocTitle").innerHTML = "Current Location (" + currentLat.toString() + ", " + currentLong.toString() + ")";
														setTimeout(refreshCurrentLocation, 8000);
													}
												});
										
									}
									catch(err){
										document.getElementById("currentLocData").innerHTML = "Loading...";
										document.getElementById("currentLocTitle").innerHTML = "Current Location (" + currentLat.toString() + ", " + currentLong.toString() + ")";
										setTimeout(refreshCurrentLocation, 8000);
									}
								}
								);
							}
							catch(err){
								document.getElementById("currentLocData").innerHTML = "Loading...";
								document.getElementById("currentLocTitle").innerHTML = "Current Location (" + currentLat.toString() + ", " + currentLong.toString() + ")";
								setTimeout(refreshCurrentLocation, 8000);
							}
						}
					);
				}, function(error){
				document.getElementById("currentLocData").innerHTML = "Please allow location permission or disable this in app settings.";
			}
			);
		}
		else{
			getWeatherAlertsForPosAsync(currentLat, currentLong, (weatherAlerts) =>{
				var status = getStatusForPos(weatherAlerts);
				if (status[0] == "noalerts"){
					document.getElementById("currentLocDiv").setAttribute("class", "location currentloc");
				}
				else{
					document.getElementById("currentLocDiv").setAttribute("class", "location " + status[0]);
				}
				document.getElementById("currentLocData").innerHTML = lastLocationInfo;
				document.getElementById("currentLocTitle").innerHTML = "Current Location (" + currentLat.toString() + ", " + currentLong.toString() + ")";
				document.getElementById("currentLocDiv").setAttribute("onclick", "navTo('current-location-data')");
			});
		}
	}
}

// Get status for a position
function getStatusForPos(nomObj){
	var warnings = 0;
	var watches = 0;
	var other = 0;
	var weatherAlerts = nomObj;
	var a = 0;
	var warningsList = [];
	var watchesList = [];
	var otherList = [];
	var statList = [];
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

// Refreshes the alerts tab
function refreshAlerts(){
	checkIfOldAlerts(true, ()=>{
		let currentAlerts = JSON.parse(localStorage.getItem("nws-alerts-current"));
		let oldAlerts = JSON.parse(localStorage.getItem("nws-alerts-old"));
		let a = 0;
		let generatedCode = "";
		let nonNullLength = 0;
		while (a < currentAlerts.length){
			if (currentAlerts[a] != null){
				generatedCode += "<h2>" + currentAlerts[a]["properties"]["event"] + "</h2>"
				generatedCode += "<h4>" + currentAlerts[a]["properties"]["headline"] + "</h4>"
				generatedCode += "<h4>" + currentAlerts[a]["properties"]["areaDesc"] + "</h4>"
				if (currentAlerts[a]["properties"]["instruction"] != null){
					generatedCode += "<h4>" + currentAlerts[a]["properties"]["instruction"] + "</h4><br>";
				}
				nonNullLength++;
			}
			a++;
		}

		if (nonNullLength === 0){
			generatedCode = "<h2>There are currently no active alerts for your locations.</h2>"
		}
		document.getElementById("active-alert-list").innerHTML = generatedCode;
		
		generatedCode = "";
		a = oldAlerts.length - 1;
		while (a > -1){
			if (oldAlerts[a] != null){
				generatedCode += "<h2>" + oldAlerts[a]["properties"]["event"] + "</h2>"
				generatedCode += "<h4>" + oldAlerts[a]["properties"]["headline"] + "</h4>"
				generatedCode += "<h4>" + oldAlerts[a]["properties"]["areaDesc"] + "</h4><br>"
			}
			a--;
		}
		if (oldAlerts.length == 0){
			generatedCode = "<h2>You have no previously received alerts.</h2>"
		}
		document.getElementById("old-alert-list").innerHTML = generatedCode;
	})
}

// Loads the information for an alert and displays it
function loadAlert(alertID){
	clearMap();
	var theSplit = alertID.split("-");
	var locationIndex = parseInt(theSplit[0]);
	var alertIndex = parseInt(theSplit[1]);
	var theLocation = JSON.parse(localStorage.getItem("weather-locations"))[locationIndex];
	getWeatherAlertsForNomAsync(theLocation, (theAlert) => {
		theAlert = theAlert[0][alertIndex];
		getPolyBoundariesAsync(theAlert, (alertBoundaries) => {
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
			var styling;
			if (theAlert["properties"]["event"].toLowerCase().includes("warning")){
				styling = {"color":"red"};
			}
			else if (theAlert["properties"]["event"].toLowerCase().includes("watch")){
				styling = {"color":"yellow"};
			}
			else{
				styling = {"color":"blue"};
			}
			console.log(alertBoundaries);
			navTo("alert-display")
			setTimeout(function(){
				let polygon = L.geoJSON(alertBoundaries, {style:styling});
				polygon.addTo(map);
				console.log(alertBoundaries);
				console.log(polygon);
				map.invalidateSize(true)
				setTimeout(function(){
					map.fitBounds(polygon.getBounds());
				}, 1000);
			}, 1000)
		});
	})
}

function loadAlertForCurrent(alertObj){
	clearMap();
	// var theSplit = alertID.split("-");
	// var locationIndex = parseInt(theSplit[0]);
	// var alertIndex = parseInt(theSplit[1]);
	// var theLocation = JSON.parse(localStorage.getItem("weather-locations"))[locationIndex];
	// var theAlert = getWeatherAlertsForNom(theLocation);
	getWeatherAlertsForPosAsync(currentLat, currentLong, (res) => {
		theAlert = res[alertObj];
		getPolyBoundariesAsync(theAlert, (alertBoundaries) => {
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
			var styling;
			if (theAlert["properties"]["event"].toLowerCase().includes("warning")){
				styling = {"color":"red"};
			}
			else if (theAlert["properties"]["event"].toLowerCase().includes("watch")){
				styling = {"color":"yellow"};
			}
			else{
				styling = {"color":"blue"};
			}
			var x = 0;
			navTo("alert-display")
			setTimeout(function(){
				let polygon = L.geoJSON(alertBoundaries, {style:styling}).addTo(map);
				map.invalidateSize(true)
				setTimeout(function(){
					map.fitBounds(polygon.getBounds());
				}, 1000);
			}, 1000)
		});
	});
}

// Clears polygons from the LeafletJS alert map
function clearMap() {
    for(i in map._layers) {
        if(map._layers[i]._path != undefined) {
            try {
                map.removeLayer(map._layers[i]);
            }
            catch(e) {
                console.log("Error removing " + e + map._layers[i]);
            }
        }
    }
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
			document.getElementById("welcome-body-native").innerHTML = "No tracking. No data selling.<br>Atmos Weather only uses the information necessary to provide app features.<br>Precise location data is only sent to the National Weather Service, Open-Meteo, and OpenStreetMap.<br>A full list of how your information is handled can be found in the privacy statement (located in settings.)";
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
			setTimeout(function(){
				document.getElementById("android-permission-setup").hidden = false;
				repeatPermCheck();
				document.getElementById("welcome-window-native").hidden=true;
				}, 2000);
		}
		
	}, 750);
}

function makeGauge(value, min, max){
	if (value > max){
		value = max;
	}
	if (value < min){
		value = min;
	}
	let container = document.createElement("div");
	container.className = "gauge-container";
	let gaugeBackground = document.createElement("div");
	gaugeBackground.className = "gauge-background";
	container.appendChild(gaugeBackground);
	let gaugeMarker = document.createElement("div");
	gaugeMarker.className = "gauge-marker";
	let leftAmount = (value-min)/(max-min);
	leftAmount = leftAmount * 100;
	if (leftAmount > 50){
		leftAmount = "calc(" + leftAmount + "% - 22px)";
	}
	else{
		leftAmount = "calc(" + leftAmount + "% + 3.5px)";
	}
	gaugeMarker.style.left = leftAmount;
	container.appendChild(gaugeMarker);
	return container;
}