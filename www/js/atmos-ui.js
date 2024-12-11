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
