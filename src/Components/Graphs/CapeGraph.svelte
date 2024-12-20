<script>
    import WeatherGraph from "./WeatherGraph.svelte";

    let { uniqueName, locationData } = $props();

    let chartList = $derived(locationData["hourly"][0]);

    let currentCape;

    const tempColorGradient = chroma.scale(['white', 'red']);

    let labelCallback = (item) =>`${item.dataset.label}: ${item.formattedValue} J/kg`;

    let imageCallback = (data, i) => {
        return "";
    }

    let gradientCallback = (data, i) => {
        if (i === 0){
            currentCape = $state.snapshot(locationData.openMeteoData["hourly"]["cape"]);
            let times = $state.snapshot(locationData.openMeteoData["hourly"]["time"]);
            currentCape = removeOldData(times, currentCape)[1];
        }
        return currentCape[i]/2500;
    }

    let dataCallback = (data, i) => currentCape[i];
</script>

{#if locationData.openMeteoData && locationData.openMeteoData["hourly"]["cape"]}
    <h1>CAPE Forecast</h1>
    <WeatherGraph chartList={chartList} title="CAPE"
                  location={locationData.name} colorGradient={tempColorGradient} labelCallback={labelCallback}
                  iconCallback={imageCallback} gradientCallback={gradientCallback} dataCallback={dataCallback}
                  uniqueName={uniqueName}>

    </WeatherGraph>
    <h6>CAPE forecast is provided by <a href='https://open-meteo.com/' target='_blank'>Open-Meteo</a></h6>
    <br>
{:else}
    <h2>Loading OpenMeteo data...</h2>
{/if}