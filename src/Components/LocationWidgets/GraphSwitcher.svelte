<script>
    import TemperatureGraph from "../Graphs/TemperatureGraph.svelte";
    import PrecipitationGraph from "../Graphs/PrecipitationGraph.svelte";
    import HumidityGraph from "../Graphs/HumidityGraph.svelte";
    import WindGraph from "../Graphs/WindGraph.svelte";
    import DewpointGraph from "../Graphs/DewpointGraph.svelte";
    import FeelsLikeGraph from "../Graphs/FeelsLikeGraph.svelte";

    let { locationData } = $props();

    let name = $derived(locationData.name);
    let randomId = Math.round(Math.random()*1000000);

    let selectedGraph = $state("temp");

    function changeGraph(event) {
        selectedGraph = event.target.value;
    }
</script>

<div>
    <h1>Hourly Forecasts</h1>
    <div onchange={changeGraph}>
        <input type="radio" id="{name}-loc-hourly-temp-{randomId}" name="{name}-loc-hourly-{randomId}" value="temp" class="hourly-selector" checked>
        <label for="{name}-loc-hourly-temp-{randomId}" class="hourly-selector-label">Temperature</label>
        <input type="radio" id="{name}-loc-hourly-feels-like-{randomId}" name="{name}-loc-hourly-{randomId}" value="feels-like" class="hourly-selector">
        <label for="{name}-loc-hourly-feels-like-{randomId}" class="hourly-selector-label">Feels Like</label>
        <input type="radio" id="{name}-loc-hourly-precip-{randomId}" name="{name}-loc-hourly-{randomId}" value="precip" class="hourly-selector">
        <label for="{name}-loc-hourly-precip-{randomId}" class="hourly-selector-label">Precipitation</label>
        <input type="radio" id="{name}-loc-hourly-humid-{randomId}" name="{name}-loc-hourly-{randomId}" value="humid" class="hourly-selector">
        <label for="{name}-loc-hourly-humid-{randomId}" class="hourly-selector-label">Humidity</label>
        <input type="radio" id="{name}-loc-hourly-wind-{randomId}" name="{name}-loc-hourly-{randomId}" value="wind" class="hourly-selector">
        <label for="{name}-loc-hourly-wind-{randomId}" class="hourly-selector-label">Wind Speed</label>
        <input type="radio" id="{name}-loc-hourly-dewpoint-{randomId}" name="{name}-loc-hourly-{randomId}" value="dewpoint" class="hourly-selector">
        <label for="{name}-loc-hourly-dewpoint-{randomId}" class="hourly-selector-label">Dew Point</label>
    </div>

    {#if selectedGraph === "temp"}
        <TemperatureGraph uniqueName="hourly" locationData={locationData} />
    {/if}
    {#if selectedGraph === "precip"}
        <PrecipitationGraph uniqueName="hourly" locationData={locationData} />
    {/if}
    {#if selectedGraph === "humid"}
        <HumidityGraph uniqueName="hourly" locationData={locationData} />
    {/if}
    {#if selectedGraph === "wind"}
        <WindGraph uniqueName="hourly" locationData={locationData} />
    {/if}
    {#if selectedGraph === "dewpoint"}
        <DewpointGraph uniqueName="hourly" locationData={locationData} />
    {/if}
    {#if selectedGraph === "feels-like"}
        <FeelsLikeGraph uniqueName="hourly" locationData={locationData} />
    {/if}
    <h6>Feels Like temperature is provided by <a href='https://open-meteo.com/' target='_blank'>Open-Meteo</a></h6>
    <br>
</div>

<style>
    .hourly-selector-label {
        cursor: pointer;
        margin-right: 20px;
        user-select: none;
    }

    .hourly-selector:checked + .hourly-selector-label {
        text-decoration: underline solid;
        font-weight: 700;
    }

    .hourly-selector {
        display: none;
    }
</style>