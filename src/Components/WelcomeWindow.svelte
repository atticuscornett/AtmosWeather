<script>
    let showWelcome = $state(false);

    window.showNativeWelcome = () => {
        showWelcome = true;
    }

    let welcomeTitle = $state("Welcome To Atmos Weather");
    let welcomeBody = $state("Atmos Weather is the ultimate lightweight weather forecast and alert program.");
    let welcomeImage = $state("img/sunny-day.svg");
    let welcomeStyle = $state("animation: simpleFadeIn 2s; animation-fill-mode: forwards;");

    function showNextIntro(){
        welcomeStyle = "animation: simpleFadeOut 0.5s; animation-fill-mode: forwards;";
        setTimeout(function(){
            welcomeStyle = "animation: simpleFadeIn 2s; animation-fill-mode: forwards;";
            if (welcomeTitle === "Welcome To Atmos Weather"){
                welcomeTitle = "Prepare For The Day Ahead";
                welcomeBody = "With forecast notifications for rain, storms, and severe weather, never get caught unprepared again.";
                welcomeImage = "img/storm-illustration.svg";
            }
            else if (welcomeTitle === "Prepare For The Day Ahead"){
                welcomeTitle = "Stay Safe And Informed";
                welcomeBody = "Atmos Weather gives highly detailed weather alert notifications and provides all the information you need to make critical decisions.<br>Alert polygons are shown on a map to give more exact details on location.";
                welcomeImage = "img/push-notifications.svg";
            }
            else if (welcomeTitle === "Stay Safe And Informed"){
                welcomeTitle = "Everywhere You Care About";
                welcomeBody = "Atmos Weather doesn't limit features to a single location.<br>You can add as many locations as you want and experience the full power of Atmos Weather for each one.";
                welcomeImage = "img/location-search.svg";
            }
            else if (welcomeTitle === "Everywhere You Care About"){
                welcomeTitle = "Privacy First";
                welcomeBody = "No tracking. No data selling.<br>Atmos Weather only uses the information necessary to provide app features.<br>Precise location data is only sent to the National Weather Service, Open-Meteo, and OpenStreetMap.<br>A full list of how your information is handled can be found in the privacy statement (located in settings.)";
                welcomeImage = "img/privacy.svg";
            }
            else if (welcomeTitle === "Privacy First"){
                welcomeTitle = "No Bloat";
                welcomeBody = "Built on free services, Atmos Weather doesn't need to inject ads or other trackers to make a profit.<br>This allows Atmos to be free of the junk that slows down most apps.";
                welcomeImage = "img/fast-loading.svg";
            }
            else{
                welcomeStyle = "animation: simpleFadeOut 2s; animation-fill-mode: forwards;";
                localStorage.setItem("run-before", "true");
				setTimeout(function(){
					showWelcome = false;
				}, 2000);
                if (platform === "android"){
                    showPermissionDialog();
                }
                else {
                    showNotices();
                }
            }

        }, 750);
    }
</script>

{#if showWelcome}
	<div id="welcome-window-native">
		<div style={welcomeStyle}>
			<center>
				<br>
				<img src="img/logo.svg" id="atmos-logo-welcome">
			</center>
			<center id="fade-section">
				<br>
				<img id="welcome-image-native" src={welcomeImage}>
				<h1 id="welcome-title-native">{welcomeTitle}</h1>
				<h3 id="welcome-body-native">{@html welcomeBody}</h3>
				<br>
				<button id="welcome-button-native" onclick={showNextIntro}>Next</button>
			</center>
		</div>
	</div>
{/if}

<style>
    #atmos-logo-welcome {
        max-width: 75%;
        max-height: 10vh;
    }

	:global(body.dark) #welcome-window-native{
		z-index: 100;
		position: absolute;
		background-color: #222222;
		min-width: 100%;
		min-height: 100%;
		top: 0;
		left: 0;
	}

	#welcome-window-native{
		z-index: 99;
		position: absolute;
		background-color: black;
		min-width: 100%;
		min-height: 100%;
		top: 0;
		left: 0;
		color: white;
	}

	#welcome-button-native{
		border: none;
		background-color: dodgerblue;
		color: white;
		font-family: Secular One, sans-serif;
		font-size: 25px;
		border-radius: 7px;
		cursor: pointer;
	}

	#welcome-image-native{
		max-height: 50vh;
		max-width: 100vh;
	}

	h3 {
		margin-right: 25px;
		margin-left: 25px;
	}
</style>