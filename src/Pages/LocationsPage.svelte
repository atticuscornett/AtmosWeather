<script>
    import TabSlot from "../Layout/TabSlot.svelte";
    import LocationBar from "../Components/LocationBar.svelte";

    let { page = $bindable(), weatherDataDictionary = $bindable() } = $props();

    let nomLocations = $state(JSON.parse(localStorage.getItem("weather-locations")));
    let nomLocationNames = $state(JSON.parse(localStorage.getItem("weather-location-names")));
    let settings = $state(JSON.parse(localStorage.getItem("atmos-settings")));
    let showCurrentLocation = $state(window.locationEnabled);

    let alertLocations = $state([]);
    let otherLocations = $state([]);
    let mainLocations = $state([]);

    let refreshLocations = () => {
        if (page !== "locations"){
            return;
        }
        alertLocations = [];
        otherLocations = [];
        mainLocations = [];

        showCurrentLocation = window.locationEnabled;
        nomLocations = JSON.parse(localStorage.getItem("weather-locations"));
        nomLocationNames = JSON.parse(localStorage.getItem("weather-location-names"));
        settings = JSON.parse(localStorage.getItem("atmos-settings"));

        for (let i = 0; i < nomLocations.length; i++){
            nomToWeatherGridAsync(nomLocations[i], (nomRes) => {
                getHourlyForecastAsync(nomRes, (hourly) => {
                    getStatusAsync(nomLocations[i], (fullStatus, weatherAlerts) => {
                        let alertStatus = fullStatus[0];

                        let locationData = {
                            name: nomLocationNames[i],
                            alert: alertStatus,
                            fullStatus: fullStatus,
                            hourly: hourly,
                            alerts: weatherAlerts
                        }

                        getForecastAsync(nomRes, (forecast) => {
                            locationData.forecast = forecast;
                            weatherDataDictionary[nomLocationNames[i]] = locationData;
                        });

                        getAdditionalWeatherDataForNomAsync(nomLocations[i], (additionalData) => {
                            locationData.openMeteoData = additionalData;
                            weatherDataDictionary[nomLocationNames[i]] = locationData;
                        });

                        getCurrentAQIForNomAsync(nomLocations[i], (AQI) => {
                            locationData.AQI = AQI;
                            weatherDataDictionary[nomLocationNames[i]] = locationData;
                        });

                        weatherDataDictionary[nomLocationNames[i]] = locationData;
                        console.log(weatherDataDictionary);

                        if (!hourly[0]){
                            setTimeout(refreshLocations, 7000);
                        }

                        if (alertStatus === "warning"){
                            alertLocations.push(locationData);
                        }
                        else if (alertStatus === "watch" || alertStatus === "other"){
                            otherLocations.push(locationData);
                        }
                        else{
                            mainLocations.push(locationData);
                        }
                    });
                });
            });
        }
    }
</script>

<TabSlot name="locations" bind:page={page} onOpen={refreshLocations}>
    <h1>Locations</h1>
    <div id="alert-locations">
        {#each alertLocations as locationData}
            <LocationBar locationData={locationData} bind:page={page} />
        {/each}
    </div>
    <div id="other-locations">
        {#each otherLocations as locationData}
            <LocationBar locationData={locationData} bind:page={page} />
        {/each}
    </div>
    <div id="main-locations">
        {#if nomLocations.length === 0 && !showCurrentLocation}
            <div class="location"><h2>You have no locations.</h2></div>
        {/if}
        {#each mainLocations as locationData}
            <LocationBar locationData={locationData} bind:page={page} />
        {/each}
    </div>
    <button id="add-location" onclick={page="search"}>Add Location +</button>
</TabSlot>

<style>
    #main-locations {
        margin-bottom: 150px;
    }

    #add-location{
        position: fixed;
        z-index: 99;
        bottom: 10%;
        padding-left: 15px;
        padding-right: 15px;
        border: none;
        background-color: rgba(34,55,91,0.88);
        color: white;
        font-family: Secular One, sans-serif;
        font-size: 25px;
        border-radius: 7px;
        cursor: pointer;
        box-shadow: 0 0 7px #898989;
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