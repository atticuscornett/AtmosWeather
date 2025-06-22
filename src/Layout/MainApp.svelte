<script>
    import AboutPage from "../Pages/AboutPage.svelte";
    import PrivacyPage from "../Pages/PrivacyPage.svelte";
    import SettingsPage from "../Pages/SettingsPage.svelte";
    import LocationsPage from "../Pages/LocationsPage.svelte";
    import SearchPage from "../Pages/SearchPage.svelte";
    import LocationWeatherPage from "../Pages/LocationWeatherPage.svelte";
    import LocationAlertPage from "../Pages/LocationAlertPage.svelte";
    import AlertsPage from "../Pages/AlertsPage.svelte";
    import RadarPage from "../Pages/RadarPage.svelte";
    import LocationSettingsPage from "../Pages/LocationSettingsPage.svelte";
    import AndroidPermissionPopup from "../Components/AndroidPermissionPopup.svelte";
    import WelcomeWindow from "../Components/WelcomeWindow.svelte";
    import LoadingDots from "../Components/LoadingDots.svelte";
    import DeferRendering from "../Components/DeferRendering.svelte";

    let { page = $bindable() } = $props();
    let weatherDataDictionary = $state({});
    let alertSelection = $state({});
    let lastPage = "locations";
    let currentPage = "locations";

    $inspect(weatherDataDictionary);

    window.currentLat = false;
    window.currentLong = false;
    window.lastLocationGrab = 0;

    window.getCurrentLocation = (callback=null) =>{

        if (navigator.geolocation){
            if (!callback){
                return;
            }

            callback(31.8088, -85.9700);
            return;

            if (Date.now() - lastLocationGrab < 60000){
                if (callback){
                    callback(currentLat, currentLong);
                }
                return;
            }

            navigator.geolocation.getCurrentPosition(function(coordObj){
                currentLat = coordObj.coords.latitude;
                currentLong = coordObj.coords.longitude;

                lastLocationGrab = Date.now();

                if (callback){
                    callback(currentLat, currentLong);
                }
            }, function(error){
                currentLat = false;
                currentLong = false;
                if (callback) {
                    callback(false, false);
                }
            })
        }
        else{
            callback(false, false);
            console.log("Geolocation is not available.")
        }


    }

    let nwsAvailable = $state(true);

    window.setNWSAvailable = (value) => {
        nwsAvailable = value;
    }

    // Update back button history
    $effect(() => {
        lastPage = currentPage;
        currentPage = page;
    })

    // Set up the back button listener
    setTimeout(() => {
        cap.addBackButtonListener(() => {
            page = lastPage;
        })
    }, 200);

    window.loadAlert = (locationName, alertID) => {
        alertSelection = {name: locationName, id: alertID};
        page = "alert-view";
    }

    getCurrentLocation();
</script>


<div id="main-app">
    {#if !nwsAvailable}
        <div class="location error" id="offlineError">
            <div id="offlineErrorChild">
                <img src="img/internet.svg">
            </div>
            <div id="offlineText"><h2>Are you offline?</h2><h3>Can't connect to the NWS API right now!</h3></div>
        </div>
    {/if}
    <br>
    <AboutPage bind:page={page}/>
    <LocationsPage bind:page={page} bind:weatherDataDictionary={weatherDataDictionary} />
    <PrivacyPage bind:page={page}/>
    <SettingsPage bind:page={page}/>
    <SearchPage bind:page={page}/>
    <AlertsPage bind:page={page}/>
    <RadarPage bind:page={page}/>

    {#if alertSelection.name}
    <LocationAlertPage bind:page={page} locationData={weatherDataDictionary[alertSelection.name]}
                       alertID={alertSelection.id}/>
    {/if}

    {#each Object.entries(weatherDataDictionary) as [key, value]}
        <DeferRendering>
            <LocationWeatherPage locationData={value} bind:page={page} bind:alertSelection={alertSelection}/>
        </DeferRendering>
    {/each}

    {#each Object.entries(weatherDataDictionary) as [key, value]}
        <LocationSettingsPage locationData={value} bind:page={page} bind:alertSelection={alertSelection}/>
    {/each}

    <AndroidPermissionPopup />
    <WelcomeWindow />
    <LoadingDots />
</div>

<style>
    #main-app{
        height: 92%;
        width: 100%;
        padding: 0;
        overflow-x: hidden;
    }

    #offlineErrorChild {
        display: inline-block;
        height: inherit;
        vertical-align: top;
        margin-top:35px;
    }

    img {
        vertical-align: center;
    }

    #offlineText {
        display:inline-block;
        margin-left:8px;
    }

    .error{
        background-color: darkslategray !important;
    }

    .location{
        background-color: blue;
        color: white;
        border-radius: 7px;
        padding-top: 1px;
        padding-bottom: 1px;
        padding-left: 20px;
        -webkit-box-sizing: border-box;
        -mox-box-sizing: border-box;
        box-sizing: border-box;
        cursor: pointer;
        box-shadow: 0 0 7px #898989;
    }
</style>