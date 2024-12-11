// UPDATE
setTimeout(() => {
    console.log("testing the waters here");
    window.PermissionManagement = cap.getPlugin("PermissionManagement");
    console.log("waters tested");
}, 1000);

setTimeout(() => {
    console.log(Capacitor)
})

setInterval(async () => {
    if (window.platform === "android"){
        console.log("Permission?")
        console.log(JSON.stringify(await window.PermissionManagement.checkPermissions()));
    }
}, 2000);


window.atmosVersion = "3.0.0-prealpha";
window.atmosUpdated = "11-5-2024";
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

window.syncFiles = () => {
    if (!getPlatform().includes("desktop") && !getPlatform().includes("pwa") && !getPlatform().includes("unknown")) {
        cap.syncPreferences();
    }
}

function getDeviceInfo(){
    try {
        cap.getDevice();
        setTimeout(getPlatform, 100);
    }
    catch {
        setTimeout(getDeviceInfo, 100);
    }
}

getDeviceInfo();

function getPlatform(){
    if (!window.deviceInfo){
        return "unknown";
    }
    else {
        let platform = "unknown";
        if (window.deviceInfo.platform == "web") {
            // Running either electron version or online version
            if (navigator.userAgent.includes("Electron")) {
                if (navigator.platform.indexOf("Win") == 0) {
                    platform = "desktop-windows"
                } else if (navigator.platform.indexOf("Mac") == 0) {
                    platform = "desktop-mac"
                } else {
                    platform = "desktop-linux"
                }
            } else {
                platform = "pwa";
            }
        } else {
            if (window.deviceInfo.platform == "electron") {
                if (navigator.platform.indexOf("Win") == 0) {
                    platform = "desktop-windows"
                } else if (navigator.platform.indexOf("Mac") == 0) {
                    platform = "desktop-mac"
                } else {
                    platform = "desktop-linux"
                }
            } else {
                platform = window.deviceInfo.platform;
            }
        }
        window.platform = platform;
        return platform;
    }
}

// Adds function to the navigation buttons (from atmos-ui.js)
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

// Refresh duration text on slider change
document.getElementById("setting-page-transition-duration").onchange = () => {
document.getElementById("setting-page-transition-duration-text").innerHTML = Number(document.getElementById("setting-page-transition-duration").value) + "ms";
}

// Refresh radar when weather outlook changes
document.getElementById("spc-select").onchange = () => {

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