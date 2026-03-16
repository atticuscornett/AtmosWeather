// UPDATE
setTimeout(() => {
    window.PermissionManagement = cap.getPlugin("PermissionManagement")
}, 100);

let updateFiles = false;

window.atmosVersion = "3.0.5";
window.atmosUpdated = "3-16-2026";
window.atmosUpdateTitle = "Atmos Weather v3.0.5 is here!";
window.atmosUpdateNotes = `
		<dl style='font-family: Secular One, sans-serif;'>
		    <dt>New Features</dt>
		    <dd>- Added radar time slider</dd>
		    <dt>Bug Fixes</dt>
		    <dd>- Updated privacy statement</dd>
		    <dd>- Fixed radar zoom issues</dd>
		    <dd>- Removed radar color selection</dd>
		    <dd>- Fixed Atmos being unclosable on desktop</dd>
		    <dd>- Fixed locations appearing multiple times</dd>
		</dl> 
		`;

// Sync files with native code
window.syncFiles = () => {
    if (!getPlatform().includes("desktop") && !getPlatform().includes("pwa") && !getPlatform().includes("unknown")) {
        updateFiles = true;
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

// Returns the platform that Atmos Weather is running on
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

const checkAPIstatus = async () => {
    try {
        const online = await fetch("https://api.weather.gov");
        return online.status >= 200 && online.status < 300;
    } catch (err) {
        return false;
    }
};


// Adds function to the navigation buttons (from atmos-ui.js)
// Check status of NWS API periodically (from atmos-ui.js)
setInterval(async () => {
    setNWSAvailable(await checkAPIstatus());
}, 60000);
setTimeout(async () => {
    setNWSAvailable(await checkAPIstatus());
}, 100);

// Update files maximum of once per second
setInterval(async () => {
    if (updateFiles) {
        updateFiles = false;
        try {
            cap.syncPreferences();
        } catch (err) {
            console.error("Error updating files:", err);
        }
    }
}, 1000);
