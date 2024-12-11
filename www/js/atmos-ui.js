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

// Checks if the NWS weather API is available
const checkAPIstatus = async () => {
  try {
    const online = await fetch("https://api.weather.gov");
    return online.status >= 200 && online.status < 300;
  } catch (err) {
    return false;
  }
};

// Sync with native code
function syncFiles(){
	if (!getPlatform().includes("desktop") && !getPlatform().includes("pwa")){
		cap.syncPreferences();
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