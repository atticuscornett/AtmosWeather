<script>
    let { addingWidget=$bindable(), widgetRow, locationData=$bindable(), widgetLayout = $bindable()} = $props();

    function addWidget(e){
        widgetLayout[widgetRow].push(e.target.value);
        addingWidget = false;
        e.stopPropagation();
        getAdditionalWeatherDataForNomAsync(locationData.nominatim, (additionalData)=>{
            locationData.openMeteoData = additionalData;
        }, widgetLayout)
    }



    function cancel(){
        addingWidget = false;
    }

    function stopPropagation(e){
        e.stopPropagation();
    }
</script>

<div class="gray-background" onclick={cancel}>
    <div class="popup-container" onclick={stopPropagation}>
        <h1>Add Widget</h1>
        <details>
            <summary>General</summary>
            <button onclick={addWidget} value="LocationAtAGlance">Location At A Glance</button>
            <button onclick={addWidget} value="WeekAtAGlance">Week At A Glance</button>
            <button onclick={addWidget} value="LongNWSForecast">NWS Full-text Forecast</button>
            <button onclick={addWidget} value="SunriseSunset">Sunrise/Sunset</button>
        </details>

        <details>
            <summary>Advanced</summary>
        </details>

        <details>
            <summary>15-minute Forecasts</summary>
            <button onclick={addWidget} value="Next15Minutes">Next 15 Minutes</button>
        </details>

        <details>
            <summary>Graphs</summary>
            <button onclick={addWidget} value="GraphSwitcher">Graph Switcher</button>
            <button onclick={addWidget} value="TemperatureGraph">Temperature/Condition Graph</button>
            <button onclick={addWidget} value="PrecipitationGraph">Precipitation Graph</button>
            <button onclick={addWidget} value="WindGraph">Wind Graph</button>
            <button onclick={addWidget} value="HumidityGraph">Humidity Graph</button>
            <button onclick={addWidget} value="DewpointGraph">Dew Point Graph</button>
            <button onclick={addWidget} value="FeelsLikeGraph">Feels Like Graph</button>
            <button onclick={addWidget} value="CAPEGraph">CAPE Graph</button>
        </details>

        <details>
            <summary>Air Quality</summary>
            <button onclick={addWidget} value="AirQualityIndex">Air Quality Index</button>
            <button onclick={addWidget} value="AQIBreakdown">Air Quality Breakdown</button>
            <button onclick={addWidget} value="AllPollutants">All Pollutants</button>
        </details>
    </div>
</div>

<style>
    .gray-background {
        background-color: rgba(0,0,0,0.5);
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 100;
    }

    .popup-container {
        background-color: white;
        width: 80%;
        max-height: 80vh;
        margin: 0 auto;
        padding: 20px;
        border-radius: 10px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        overflow: auto;
    }

    :global(body.dark) .popup-container{
        background-color: #111111;
    }

    button {
        width: 100%;
        cursor: pointer;
        background-color: darkslategray;
        color: white;
        border: none;
        border-radius: 7px;
        font-size: 20px;
        font-family: Secular One, sans-serif;
        margin-top: 7px;
        margin-bottom: 7px;
    }

</style>