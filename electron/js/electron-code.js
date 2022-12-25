cordovaReady = true;
var allAudio = [];

function stopAllAudio(){
	var a = 0;
	while (a < allAudio.length){
		allAudio[a].pause();
		a++;
	}
	allAudio = [];
}

// Decides if there are any notices to show, and if so, creates them and shows them
function showNotices(){
	if (!localStorage.getItem("run-before")){
		document.getElementById("welcome-window-native").hidden = false;
		document.getElementById("atmos-logo").style = "animation: fadeOut 2s; animation-fill-mode: forwards;";
		return;
	}
	if (!cordovaReady){
		setTimeout(showNotices, 1000);
		return;
	}
	document.getElementById("atmos-logo").style = "animation: fadeOut 2s; animation-fill-mode: forwards;"
	// Hide geolocation settings
	document.getElementById("settings-device-location").hidden = true;
	var elementsList = document.querySelectorAll(`[value="alertmove"]`);
	var b = 0;
	while (b < elementsList.length){
		elementsList[b].remove();
		b++;
	}
	// Check if running the web browser version
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
		<h3>Although we strive to give rapid, accurate warning notifications 24/7, Atmos Weather should not be your only method of receiving emergency alerts. If internet service is lost or other errors occur, Atmos cannot give you alerts. All homes should have at least one weather radio with a battery backup so that they can receive weather information even when the power is out. Atmos Weather is not responsible for alerts not sending or the consequences of alerts not sending.</h3>
		<br><br>
		`
		document.getElementById("notice-window-container").hidden = false;
		window.localStorage.setItem("notice-weatherAlerts", "true");
	}
	JSONGetAsync("https://atticuscornett.github.io/AtmosWeather/package.json", (latest) => {
		latest = latest["version"];
		if (latest != version && !platform.includes("windows")){
			document.getElementById("notice-window").innerHTML += `
			<h2>An update is available!</h2>
			<hr>
			<h3>You are on an older version of Atmos Weather (` + version + `).<br>
			A new version of Atmos Weather (` + latest +  `)
			 can be downloaded <a href="https://atticuscornett.github.io/AtmosWeather" target="_blank">here</a>.<br>
			Updates may include security upgrades, so it is important to keep your apps updated.</h3>
			<br><br>
			`;
		}
	});
	// UPDATE
	if (!window.localStorage.getItem("notice-version1.0.2")){
		document.getElementById("notice-window").innerHTML += `
		<h2>Atmos Weather v1.0.2 is here!</h2>
		<hr>
		 <dl style='font-family: Secular One;'>
			<dt>New Features</dt>
  			<dd>- Added support for 7 new event types, just in time for winter weather.</dd>
  			<dd>- New version popup added for non-Windows devices.</dd>
  			<dt>Bug Fixes Everywhere</dt>
  			<dd>- Fixed text running off screen on certain screens.</dd>
  			<dd>- Fixed hourly forecast UI issues on certain devices.</dd>
  			<dd>- Fixed minor spelling errors.</dd>
  			<dd>- Fixed blank locations page on first run.</dd>
  			<dd>- Fixed potential issue with alerts page.</dd>
  			<dd>- Other internal code changes made that should improve future development.</dd>
  			<dt>Security Updates</dt>
  			<dd>- Security updates that remove known Electron vulnerabilities on desktop.</dd>
  			<dd>- Security updates that improve resilience to XSS attacks.</dd>
		</dl> 
		<br><br>
		`;
		document.getElementById("notice-window-container").hidden = false;
		window.localStorage.setItem("notice-version1.0.2", "true");
	}
	console.log(platform);
	if (platform == "pwa"){
		document.getElementById("settings-warning").hidden = false;
	}
}

// Check the version of Atmos being run
function getPlatform(){
	var platform = "unknown"
	if (navigator.platform.indexOf("Win") == 0){
		platform = "desktop-windows"
	}
	else if (navigator.platform.indexOf("Mac") == 0){
		platform = "desktop-mac"
	}
	else{
		platform = "desktop-linux"
	}
	window.platform = platform;
	return platform;
}