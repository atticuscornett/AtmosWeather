<script>
    import WeatherGraph from "./WeatherGraph.svelte";

    let { uniqueName, locationData } = $props();

    let chartList = $derived(locationData["hourly"][0]);

    let currentAQI;

    const root = document.documentElement;
    const startGradientColor = getComputedStyle(root).getPropertyValue('--cape-graph-start').trim();
    const endGradientColor = getComputedStyle(root).getPropertyValue('--cape-graph-end').trim();

    const tempColorGradient = chroma.scale(["green", "yellow", "orange", "red", "pink", "brown"]);

    let labelCallback = (item) =>`${item.dataset.label}: ${item.formattedValue}`;

    let imageCallback = (data, i) => {
        return "";
    }

    let gradientCallback = (data, i) => {
        if (i === 0){
            currentAQI = $state.snapshot(locationData.AirQualityAPI["hourly"]["us_aqi"]);
            let times = $state.snapshot(locationData.AirQualityAPI["hourly"]["time"]);
            currentAQI = removeOldData(times, currentAQI)[1];
        }
        return currentAQI[i]/300;
    }
    
    let dataCallback = (data, i) => currentAQI[i];
</script>

{#if locationData.AirQualityAPI && locationData.AirQualityAPI["hourly"]["us_aqi"]}
    <h1>AQI Forecast</h1>
    <WeatherGraph chartList={chartList} title="AQI"
                  location={locationData.name} colorGradient={tempColorGradient} labelCallback={labelCallback}
                  iconCallback={imageCallback} gradientCallback={gradientCallback} dataCallback={dataCallback}
                  uniqueName={uniqueName}>

    </WeatherGraph>
    <h6>AQI forecast is provided by <a href='https://open-meteo.com/' target='_blank'>Open-Meteo</a></h6>
    <br>
{:else}
    <h2>Loading OpenMeteo data...</h2>
{/if}