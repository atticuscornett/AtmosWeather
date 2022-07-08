cordovaReady = true;

// Decides if there are any notices to show, and if so, creates them and shows them
function showNotices(){
	if (!cordovaReady){
		setTimeout(showNotices, 1000);
		return;
	}
	document.getElementById("atmos-logo").style = "animation: fadeOut 2s; animation-fill-mode: forwards;"
	// Check if running the web browser version
	/* NOTE: Unlike other messages that do not show again after they are read,
	this message will continue to pop up every time the website is accessed */
	var platform = "unknown"
	if (navigator.platform.indexOf("Win") == 0){
		console.log("Atmos for Windows")
		platform = "desktop-windows"
	}
	else if (navigator.platform.indexOf("Mac") == 0){
		console.log("Atmos for Mac")
		platform = "desktop-mac"
	}
	else{
		console.log("Atmos for Linux/Other")
		platform = "desktop-linux"
	}
	
	// Important Notice About Weather Alerts
	if (!window.localStorage.getItem("notice-weatherAlerts")){
		document.getElementById("notice-window").innerHTML += `
		<h2>Important Information About Weather Warnings</h2>
		<hr>
		<h3>Although we strive to give rapid, accurate warning notifications 24/7, Atmos Weather should not be your only method of recieving emergency alerts. If internet service is lost, Atmos cannot give you alerts. All homes should have at least one weather radio with a battery backup so that they can recieve weather information even when the power is out.</h3>
		<br><br>
		`
		document.getElementById("notice-window-container").hidden = false;
		window.localStorage.setItem("notice-weatherAlerts", "true");
	}
	
	if (!window.localStorage.getItem("notice-version0.5")){
		document.getElementById("notice-window").innerHTML += `
		<h2>Atmos v0.5 is here!</h2>
		<hr>
		 <dl style='font-family: Secular One;'>
			<dt>New Features</dt>
  			<dd>- Android version under development</dd>
			<dd>- Ultra-customizable settings page for complete control</dd>
			<dd>- Android boot service and notifications</dd>
  			<dt>Bug Fixes Everywhere</dt>
  			<dd>- BackgroundService on Android can now access up to date data.</dd>
			<dd>- Added Cordova Plugins: NativeStorage</dd>
			<dd>- Added Java Dependencies: Gson, Volley, StringUtils</dd>
			<dt>Oh, and one more thing...</dt>
			<dd>Github repo created, allowing for easier development across devices and constant code backups.</dd>
		</dl> 
		<br><br>
		`
		document.getElementById("notice-window-container").hidden = false;
		window.localStorage.setItem("notice-version0.5", "true");
	}
	
	// Congressional App Challenge Outdated Version Warning
	document.getElementById("notice-window").innerHTML += `
	<h2>You are running the Congressional App Challenge version of Atmos Weather.</h2>
	<hr>
	<h3>Atmos Weather was originally created as an app for the Congressional App Challenge. However, the app has been updated since then. This is the version of Atmos that was current as of submission to the Congressional App Challenge, and is available as a snapshot to show the features that were created before submission. If you intended to use this outdated version of Atmos, you can ignore this message.</h3>
	<br><br>
	`
	document.getElementById("notice-window-container").hidden = false;
	console.log(platform);
	if (platform == "pwa"){
		document.getElementById("settings-warning").hidden = false;
	}
}

// Check the version of Atmos being run
function getPlatform(){
	var platform = "unknown"
	if (navigator.platform.indexOf("Win") == 0){
		console.log("Atmos for Windows")
		platform = "desktop-windows"
	}
	else if (navigator.platform.indexOf("Mac") == 0){
		console.log("Atmos for Mac")
		platform = "desktop-mac"
	}
	else{
		console.log("Atmos for Linux/Other")
		platform = "desktop-linux"
	}
	window.platform = platform;
	return platform;
}