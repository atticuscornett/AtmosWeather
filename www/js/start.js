// UPDATE
window.atmosVersion = "2.2.1";
window.atmosUpdated = "11-2-2024";
window.atmosUpdateTitle = "Atmos Weather v2.2.1 is here!";
window.atmosUpdateNotes = `
		<dl style='font-family: Secular One;'>
			<dt>Bug Fixes</dt>
			<dd>- Fixed wind speed graph bug.</dd>
			<dd>- Fixed battery optimization permission UI bug.</dd>
			<dd>- Fixed permission window repeatedly showing on first installation.</dd>
			<dd>- Updated packages.</dd>
		</dl> 
		`;
document.getElementById("atmos-app-version").innerHTML = "Version " + window.atmosVersion;
document.getElementById("atmos-app-updated").innerHTML = "Updated on " + window.atmosUpdated;

// Set global app theme
function refreshAppTheme(){
    window.appTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    let currentSettings = JSON.parse(localStorage.getItem("atmos-settings"));
    if (currentSettings["personalization"]){
        if (currentSettings["personalization"]["theme"] !== "system"){
            window.appTheme = currentSettings["personalization"]["theme"];
        }
    }
    document.body.setAttribute("class", window.appTheme);
}
setTimeout(refreshAppTheme, 100);

// Fade out logo and handle notices after animation is done or immediately if it's disabled
let noticeTimeout = 0;

function noticeSetup() {
    if (localStorage.getItem("atmos-settings") !== null) {
        let settings = JSON.parse(localStorage.getItem("atmos-settings"));
        if (settings["personalization"]["atmos-logo"]) {
            setTimeout(function () {
                showNotices();
            }, 2000);
        } else {
            document.getElementById("atmos-logo").hidden = true;
            showNotices();
        }
    } else {
        setTimeout(function () {
            showNotices();
        }, 2000);
    }
}

noticeSetup();

// Adds function to the navigation buttons (from atmos-ui.js)
activateNavButtons();
// Check status of NWS API periodically (from atmos-ui.js)
setInterval(async () => {
      const result = await checkAPIstatus();
      if (!result){
        document.getElementById("offlineError").hidden = false;
    }
    else{
        document.getElementById("offlineError").hidden = true;
    }
}, 60000);
setTimeout(async () => {
      const result = await checkAPIstatus();
      if (!result){
        document.getElementById("offlineError").hidden = false;
    }
    else{
        document.getElementById("offlineError").hidden = true;
    }
}, 100);

// Allow Enter key on search
document.getElementById("location-search").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        document.getElementById("search-button").click();
      }
});

// Refresh duration text on slider change
document.getElementById("setting-page-transition-duration").onchange = () => {
document.getElementById("setting-page-transition-duration-text").innerHTML = Number(document.getElementById("setting-page-transition-duration").value) + "ms";
}

// Refresh radar when weather outlook changes
document.getElementById("spc-select").onchange = () => {
    let value = document.getElementById("spc-select").value;
    if (value == "severe-outlook"){
        outlookLink = "https://mapservices.weather.noaa.gov/vector/rest/services/outlooks/SPC_wx_outlks/MapServer/";
    }
    else if (value == "fire-outlook"){
        outlookLink = "https://mapservices.weather.noaa.gov/vector/rest/services/fire_weather/SPC_firewx/MapServer";
    }
    else{
        outlookLink = "https://mapservices.weather.noaa.gov/vector/rest/services/hazards/cpc_weather_hazards/MapServer";
    }
    reloadOutlook();
}

// Save settings when a setting is changed
document.getElementById("tab-settings").onchange = saveSettings;
document.getElementById("tab-single-location-settings").onchange = saveLocationSettings;

document.getElementById("current-loc-hourly-select").onchange = switchGraphs;

// Switch between hourly graphs
function switchGraphs(e){
    let targetPrefix = e.target.id.split("-")[0];
    document.getElementById(targetPrefix + "-loc-hourly-temp-chart-container").style.display = "none";
    document.getElementById(targetPrefix + "-loc-hourly-feels-like-chart-container").style.display = "none";
    document.getElementById(targetPrefix + "-loc-hourly-precip-chart-container").style.display = "none";
    document.getElementById(targetPrefix + "-loc-hourly-humid-chart-container").style.display = "none";
    document.getElementById(targetPrefix + "-loc-hourly-wind-chart-container").style.display = "none";
    document.getElementById(targetPrefix + "-loc-hourly-dewpoint-chart-container").style.display = "none";
    document.getElementById(targetPrefix + "-loc-hourly-" + e.target.value + "-chart-container").style.display = "block";
}

function setupAndroidPermissions(){
    if (window.deviceInfo === undefined){
        setTimeout(setupAndroidPermissions, 100);
        return;
    }
    if (getPlatform() === "android"){
        window.PermissionManagement = cap.getPlugin("PermissionManagement");
        repeatPermCheck();

        document.getElementById("android-permission-setting").hidden = false;
        document.getElementById("android-permission-setting").onclick = () => {
            document.getElementById("android-permission-setup").hidden = false;
            setTimeout(repeatPermCheck, 20);
        }

        // Setup permission request buttons
        document.getElementById("android-request-background-location").onclick = () => {
            PermissionManagement.requestPermission({"permission":"background-location"});
        }

        document.getElementById("android-request-notifications").onclick = () => {
            PermissionManagement.requestPermission({"permission":"notifications"});
        }

        document.getElementById("android-request-battery-exempt").onclick = () => {
            PermissionManagement.requestPermission({"permission":"battery-exempt"});
        }

        document.getElementById("android-request-exact-alarms").onclick = () => {
            PermissionManagement.requestPermission({"permission":"exact-alarms"});
        }

        document.getElementById("android-permission-dialog-close").onclick = () => {
            document.getElementById("android-permission-setup").hidden = true;
            showNotices();
        }
    }
}

// Initialize Capacitor plugins
setupAndroidPermissions();

// Refresh location data
setTimeout(refreshLocations, 200);

// Handle loading animation
document.getElementById("loading-anim").hidden = true;
window.loadingElements = 0;
function checkLoading(){
    document.getElementById("loading-anim").hidden = window.loadingElements <= 0;
}
setInterval(checkLoading, 100);