<script>
    import TemperatureGraph from "../Graphs/TemperatureGraph.svelte";
    import PrecipitationGraph from "../Graphs/PrecipitationGraph.svelte";
    import HumidityGraph from "../Graphs/HumidityGraph.svelte";
    import WindGraph from "../Graphs/WindGraph.svelte";

    let { locationData } = $props();

    let name = $derived(locationData.name);
</script>

<div>
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

    <TemperatureGraph uniqueName="hourly" locationData={locationData} />
    <PrecipitationGraph uniqueName="hourly" locationData={locationData} />
    <HumidityGraph uniqueName="hourly" locationData={locationData} />
    <WindGraph uniqueName="hourly" locationData={locationData} />
</div>