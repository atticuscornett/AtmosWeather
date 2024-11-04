<script>
    let showNotice = $state(false);

    function hideNotices(){
       showNotice = false;
    }

	window.showNotices = () => {
		if (window.platform === undefined){
			setTimeout(showNotices, 150);
			return;
		}
		if (!localStorage.getItem("run-before") && getPlatform() != "pwa"){
			document.getElementById("welcome-window-native").hidden = false;
			hideLogo();
			return;
		}
		if (!cordovaReady){
			setTimeout(showNotices, 1000);
			return;
		}
		hideLogo();
		// Check if running the web browser version
		/* NOTE: Unlike other messages that do not show again after they are read,
        this message will continue to pop up every time the website is accessed */
		var platform = "unknown"
		if (window.deviceInfo.platform == "web"){
			// Running either electron version or online version
			if (navigator.userAgent.includes("Electron")){
				console.log("Atmos Electron Version")
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
				console.log("Atmos Web Version")
				document.getElementById("notice-window").innerHTML += `
				<h2>You are using the Atmos Weather web client.</h2>
				<hr>
				<h3>Some features are limited or not available in the web client. Weather alerts can only be given while the website is open. Your saved locations are deleted whenever you clear your browser history. Forecast notifications are not available, and your location will not be updated in the background. To get weather alerts and have the best user experience, we recommend downloading our Windows or Android apps.</h3>
				<br><br>
			`
				document.getElementById("notice-window-container").hidden = false;
				platform = "pwa";
			}
		}
		else{
			if (window.deviceInfo.platform == "electron"){
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
			}
			else{
				console.log("Atmos Mobile Version - " + window.deviceInfo.platform)
				platform = window.deviceInfo.platform;
			}
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

		let notifyUpdates = true;

		let settings = JSON.parse(localStorage.getItem("atmos-settings"));

		if (settings !== undefined){
			if (settings["personalization"] !== undefined){
				if (settings["personalization"]["update-notify"] !== undefined){
					notifyUpdates = settings["personalization"]["update-notify"];
				}
			}
		}

		// Check for updates if enabled

		if (notifyUpdates) {
			JSONGetAsync("https://api.github.com/repos/atticuscornett/AtmosWeather/releases/latest", (latest) => {

				// Support tag names with and without the "v" prefix
				if (latest["tag_name"][0] === "v"){
					latest = latest["tag_name"].slice(1);
				}
				else{
					latest = latest["tag_name"];
				}

				console.log("Current version: " + window.atmosVersion);
				console.log("Latest version: " + latest);

				if (latest !== window.atmosVersion){
					document.getElementById("notice-window").innerHTML += `
			<h2>An update is available!</h2>
			<hr>
			<h3>You are on an older version of Atmos Weather (` + window.atmosVersion + `).<br>
			A new version of Atmos Weather (` + latest +  `)
			 can be downloaded <a href="https://atticuscornett.github.io/AtmosWeather" target="_blank">here</a>.<br>
			Updates may include security upgrades, so it is important to keep your apps updated.</h3>
			<br><br>
			`;
					document.getElementById("notice-window-container").hidden = false;document.getElementById("notice-window-container").hidden = false
				}
			});
		}

		if (window.localStorage.getItem("notice-version") !== window.atmosVersion){
			document.getElementById("notice-window").innerHTML += window.atmosUpdateNotes;
			document.getElementById("notice-window-container").hidden = false;
			window.localStorage.setItem("notice-version", window.atmosVersion);
		}
		if (platform === "pwa"){
			document.getElementById("settings-warning").hidden = false;
		}
	}
</script>

{#if showNotice}
	<div id="notice-window-container" hidden>
		<h1 style="margin-left:20px;color:dodgerblue;">a t m o s weather</h1>
		<div id="notice-window">
			<h2 class="closeButton" onclick={hideNotices}>x</h2>
		</div>
	</div>
{/if}

<style>
    .closeButton {
        position: absolute;
        top:0;
        right:25px;
        color:dodgerblue;
        cursor: pointer;
        text-decoration: underline;
    }

    #notice-window-container{
        z-index: 99;
        position: absolute;
        background-color: white;
        width: 100%;
        min-height: 100%;
        top: 0;
        left: 0;
    }

    #notice-window {
        padding: 20px;
    }

    :global(body.dark) #notice-window-container{
        z-index: 98;
        position: absolute;
        background-color: #222222;
        width: 100%;
        min-height: 100%;
        top: 0;
        left: 0;
    }
</style>