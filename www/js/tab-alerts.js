// Javascript for the Alerts tab

// Check if previously active is available
if (getPlatform() == "pwa"){
	document.getElementById("old-alert-list").innerHTML = "<h3>Previous alerts are not available on the web version.<br>Download the desktop or Android app to view alert history.</h3>"
}