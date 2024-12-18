<script>
    import TemperatureGraph from "../Graphs/TemperatureGraph.svelte";
    import PrecipitationGraph from "../Graphs/PrecipitationGraph.svelte";
    import HumidityGraph from "../Graphs/HumidityGraph.svelte";
    import WindGraph from "../Graphs/WindGraph.svelte";
    import DewpointGraph from "../Graphs/DewpointGraph.svelte";
    import FeelsLikeGraph from "../Graphs/FeelsLikeGraph.svelte";

    let { locationData } = $props();

    let name = $derived(locationData.name);

    let selectedGraph = $state("temp");

    function changeGraph(event) {
        selectedGraph = event.target.value;
    }
</script>

<div>
    <h1>Hourly Forecasts</h1>
    <div onchange={changeGraph}>
        <input type="radio" id="{name}-loc-hourly-temp" name="{name}-loc-hourly" value="temp" class="hourlySelector" checked>
        <label for="{name}-loc-hourly-temp" class="hourlySelectorLabel">Temperature</label>
        <input type="radio" id="{name}-loc-hourly-feels-like" name="{name}-loc-hourly" value="feels-like" class="hourlySelector">
        <label for="{name}-loc-hourly-feels-like" class="hourlySelectorLabel">Feels Like</label>
        <input type="radio" id="{name}-loc-hourly-precip" name="{name}-loc-hourly" value="precip" class="hourlySelector">
        <label for="{name}-loc-hourly-precip" class="hourlySelectorLabel">Precipitation</label>
        <input type="radio" id="{name}-loc-hourly-humid" name="{name}-loc-hourly" value="humid" class="hourlySelector">
        <label for="{name}-loc-hourly-humid" class="hourlySelectorLabel">Humidity</label>
        <input type="radio" id="{name}-loc-hourly-wind" name="{name}-loc-hourly" value="wind" class="hourlySelector">
        <label for="{name}-loc-hourly-wind" class="hourlySelectorLabel">Wind Speed</label>
        <input type="radio" id="{name}-loc-hourly-dewpoint" name="{name}-loc-hourly" value="dewpoint" class="hourlySelector">
        <label for="{name}-loc-hourly-dewpoint" class="hourlySelectorLabel">Dew Point</label>
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
    .hourlySelectorLabel {
        cursor: pointer;
        margin-right: 20px;
        user-select: none;
    }

    .hourlySelector:checked + .hourlySelectorLabel {
        text-decoration: underline solid;
        font-weight: 700;
    }

    .hourlySelector {
        display: none;
    }
</style>