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

    let currentLocationStatus = $state("loading");
    let currentLocationData = $state({});

    let widgetDictionary = $state({});

    let refreshQueued = false;

    let queueRefresh = () => {
        if (!refreshQueued){
            refreshQueued = true;
            setTimeout(refreshLocations, 5000);
            setTimeout(()=>{refreshQueued = false;}, 5000);
        }
    }

    let templates = {
        default: [],
        dense: [["LocationAtAGlance", "AirQualityIndex", "UVIndex"], ["SunriseSunset", "MoonPhase"], ["GraphSwitcher"], ["RadarGlance"]],
        conditions: [["LocationAtAGlance"], ["Next15Minutes"], ["GraphSwitcher"], ["WeekAtAGlance"], ["RadarGlance"]],
        detailed: [["LocationAtAGlance", "UVIndex"], ["MoonPhase", "SunriseSunset"], ["GraphSwitcher"], ["CAPEGraph"], ["Next15Minutes"], ["AllPollutants", "AQINext3Days"], ["RadarGlance"], ["LongNWSForecast"]],
        minimal: [["LocationAtAGlance"], ["WeekAtAGlance"], ["RadarGlance"]],
        classic: [["LocationAtAGlance"], ["AirQualityIndex"], ["GraphSwitcher"], ["LongNWSForecast"]]
    };
    window.widgetTemplates = templates;

    let refreshWidgets = () => {
        if (localStorage.getItem("widgets") === null){
            localStorage.setItem("widgets", "{}");
        }

        let widgets = JSON.parse(localStorage.getItem("widgets"));

        if (widgets["default"] === undefined){
            widgets["default"] = [["LocationAtAGlance"], ["AirQualityIndex"], ["GraphSwitcher"], ["RadarGlance"], ["LongNWSForecast"]];
        }

        widgetDictionary = widgets;
    }

    let getWidgetsForLocation = (location) => {
        templates["default"] = JSON.parse(localStorage.getItem("default-widgets"));

        if (templates["default"] === null){
            templates["default"] = [["LocationAtAGlance"], ["AirQualityIndex"], ["GraphSwitcher"], ["RadarGlance"], ["LongNWSForecast"]];
            localStorage.setItem("default-widgets", JSON.stringify(templates["default"]));
        }

        let widgetLayout;
        if (widgetDictionary[location] === undefined){
            return widgetDictionary["default"];
        }
        else {
            widgetLayout = widgetDictionary[location];
        }

        if (widgetLayout[0].includes("Template:")){
            let templateCode = widgetLayout[0];
            widgetLayout = templates[templateCode.replace("Template:", "")];
            widgetLayout.push([templateCode]);
        }

        return widgetLayout
    }

    let refreshLocations = async () => {
        let tempWeatherDataDictionary = {};
        if (page !== "locations" && page !== "location-Current Location"){
            return;
        }

        refreshWidgets();


        alertLocations = [];
        otherLocations = [];
        mainLocations = [];

        nomLocations = JSON.parse(localStorage.getItem("weather-locations"));
        nomLocationNames = JSON.parse(localStorage.getItem("weather-location-names"));
        settings = JSON.parse(localStorage.getItem("atmos-settings"));
        showCurrentLocation = settings["location"]["weather"];

        if (showCurrentLocation){
            tempWeatherDataDictionary["Current Location"] = {"name": "Current Location", "hourly": []};
            getCurrentLocation(() => {
                if (window.currentLat) {
                    setTimeout(getWeatherAlertsForPosAsync.bind(null, window.currentLat, window.currentLong, (alerts) => {
                        let status = "noalerts";

                        if (alerts.length > 0){
                            status = "other";
                        }

                        for (let i = 0; i < alerts.length; i++){
                            if (alerts[i]["properties"]["event"].toLowerCase().includes("warning")){
                                status = "warning";
                            }
                        }

                        let fullStatus = [status, 0, 0, 0];

                        for (let a = 0; a < alerts.length; a++){
                            if (alerts[a]["properties"]["event"].toLowerCase().includes("watch")){
                                fullStatus[1]++;
                            }
                            else if (alerts[a]["properties"]["event"].toLowerCase().includes("warning")){
                                fullStatus[2]++;
                            }
                            else{
                                fullStatus[3]++;
                            }
                            a++;
                        }

                        currentLocationStatus = status;

                        currentLocationData = {
                            name: "Current Location",
                            alert: status,
                            alerts: alerts,
                            fullStatus: fullStatus
                        }

                        JSONGetAsync("https://api.weather.gov/points/" + currentLat.toString() + "," + currentLong.toString(),
                            (weatherGrid) => {
                                let  hourlyForecastLink = weatherGrid["properties"]["forecastHourly"];
                                JSONGetAsync(hourlyForecastLink, (hourlyForecast) => {
                                    try {
                                        currentLocationData.hourly = [hourlyForecast["properties"]["periods"]];
                                        tempWeatherDataDictionary["Current Location"] = currentLocationData;
                                        if (status === "warning"){
                                            alertLocations.unshift(currentLocationData);
                                        }
                                        else if (status === "other"){
                                            otherLocations.unshift(currentLocationData);
                                        }
                                        else{
                                            mainLocations.unshift(currentLocationData);
                                        }
                                        JSONGetAsync(weatherGrid["properties"]["forecast"], (jsonReturn) => {
                                            tempWeatherDataDictionary["Current Location"]["forecast"] = [jsonReturn["properties"]["periods"]];
                                        })

                                        getCurrentAQIForPositionAsync(currentLat, currentLong, (AQI, currentTimeIndex) => {
                                            tempWeatherDataDictionary["Current Location"].AQI = AQI["hourly"]["us_aqi"][currentTimeIndex];
                                            tempWeatherDataDictionary["Current Location"].AirQualityAPIIndex = currentTimeIndex;
                                            tempWeatherDataDictionary["Current Location"].AirQualityAPI = AQI;
                                        }, getWidgetsForLocation("Current Location"));

                                        getAdditionalWeatherDataForPositionAsync(currentLat, currentLong, (openMeteo) => {
                                            tempWeatherDataDictionary["Current Location"].openMeteoData = openMeteo;
                                        });

                                    } catch (e) {
                                        queueRefresh();
                                    }
                                })});

                    }), 50);
                }
                else {
                    tempWeatherDataDictionary["Current Location"].denied = true;
                    mainLocations.unshift(tempWeatherDataDictionary["Current Location"]);
                }
            });
        }



        let alertLocationsDefer = [];
        let otherLocationsDefer = [];
        let mainLocationsDefer = [];

        let loadedLocations = 0;
        for (let i = 0; i < nomLocations.length; i++){
            console.log("Loading location: " + nomLocationNames[i]);

            setTimeout(nomToWeatherGridAsync.bind(null, nomLocations[i], (nomRes) => {
                getHourlyForecastAsync(nomRes, (hourly) => {
                    getStatusAsync(nomLocations[i], (fullStatus, weatherAlerts) => {
                        let alertStatus = fullStatus[0];
                        console.log(fullStatus)

                        let locationData = {
                            name: nomLocationNames[i],
                            alert: alertStatus,
                            fullStatus: fullStatus,
                            hourly: hourly,
                            alerts: weatherAlerts,
                            nominatim: nomLocations[i]
                        }

                        setTimeout(()=>{
                            getForecastAsync(nomRes, (forecast) => {
                                locationData.forecast = forecast;
                                tempWeatherDataDictionary[nomLocationNames[i]] = locationData;
                            });

                            getAdditionalWeatherDataForNomAsync(nomLocations[i], (additionalData) => {
                                locationData.openMeteoData = additionalData;
                                tempWeatherDataDictionary[nomLocationNames[i]] = locationData;
                            }, getWidgetsForLocation(nomLocationNames[i]));

                            getCurrentAQIForNomAsync(nomLocations[i], (AQI, currentTimeIndex) => {
                                locationData.AQI = AQI["hourly"]["us_aqi"][currentTimeIndex];
                                locationData.AirQualityAPIIndex = currentTimeIndex;
                                locationData.AirQualityAPI = AQI;
                                tempWeatherDataDictionary[nomLocationNames[i]] = locationData;
                            }, getWidgetsForLocation(nomLocationNames[i]));}, Math.random()*250);

                        getCurrentAQIForPositionAsync(currentLat, currentLong, (AQI, currentTimeIndex) => {
                            tempWeatherDataDictionary["Current Location"].AQI = AQI["hourly"]["us_aqi"][currentTimeIndex];
                            tempWeatherDataDictionary["Current Location"].AirQualityAPIIndex = currentTimeIndex;
                            tempWeatherDataDictionary["Current Location"].AirQualityAPI = AQI;
                        });

                        tempWeatherDataDictionary[nomLocationNames[i]] = locationData;

                        if (!hourly[0]){
                            queueRefresh();
                        }


                        loadedLocations++;
                        if (alertStatus === "warning"){
                            alertLocationsDefer.push(locationData);
                        }
                        else if (alertStatus === "watch" || alertStatus === "other"){
                            otherLocationsDefer.push(locationData);
                        }
                        else{
                            mainLocationsDefer.push(locationData);
                        }
                    });
                });
            }),
                Math.round(Math.random()*3000));
        }

        let renderLocationsSimultaneous = ()=>{
            if (loadedLocations !== nomLocations.length){
                setTimeout(renderLocationsSimultaneous, 300);
                return;
            }

            alertLocations = alertLocations.concat(alertLocationsDefer);
            otherLocations = otherLocations.concat(otherLocationsDefer);
            mainLocations = mainLocations.concat(mainLocationsDefer);
            weatherDataDictionary = tempWeatherDataDictionary;

            removeLoadingKey("allLocations");

        }

        addLoadingKey("allLocations");
        setTimeout(renderLocationsSimultaneous, 300);
    }
    window.refreshLocations = refreshLocations;



</script>

<TabSlot name="locations" bind:page={page} onOpen={refreshLocations}>
    <h1>Locations</h1>
    <div id="alert-locations">
        {#if currentLocationStatus === "warning"}
            <LocationBar bind:page={page} />
        {/if}

        {#each alertLocations as locationData}
            <LocationBar locationData={locationData} bind:page={page} />
        {/each}
    </div>
    <div id="other-locations">
        {#if currentLocationStatus === "other"}
            <LocationBar bind:page={page} />
        {/if}

        {#each otherLocations as locationData}
            <LocationBar locationData={locationData} bind:page={page} />
        {/each}
    </div>
    <div id="main-locations">
        {#if currentLocationStatus === "noalerts"}
            <LocationBar bind:page={page} />
        {/if}

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