<script>
    import WeatherGraph from "./WeatherGraph.svelte";

    let { uniqueName, locationData } = $props();

    let chartList = $derived(locationData["hourly"][0]);

    let currentTemps;

    const root = document.documentElement;
    const startGradientColor = getComputedStyle(root).getPropertyValue('--temp-graph-start').trim();
    const gradientColor2 = getComputedStyle(root).getPropertyValue('--temp-graph-2').trim();
    const gradientColor3 = getComputedStyle(root).getPropertyValue('--temp-graph-3').trim();
    const gradientColor4 = getComputedStyle(root).getPropertyValue('--temp-graph-4').trim();
    const endGradientColor = getComputedStyle(root).getPropertyValue('--temp-graph-end').trim();

    const tempColorGradient = chroma.scale([startGradientColor, gradientColor2,
        gradientColor3, gradientColor4, endGradientColor]);

    let labelCallback = (item) =>`${item.dataset.label}: ${item.formattedValue} °F`;

    let imageCallback = (data, i) => {
        return "";
    }

    let gradientCallback = (data, i) => {
        if (i === 0){
            currentTemps = $state.snapshot(locationData.openMeteoData["hourly"]["apparent_temperature"]);
            let times = $state.snapshot(locationData.openMeteoData["hourly"]["time"]);
            currentTemps = removeOldData(times, currentTemps)[1];
        }
        return currentTemps[i]/100;
    }

    let dataCallback = (data, i) => currentTemps[i];
</script>

{#if locationData.openMeteoData}
    <WeatherGraph chartList={chartList} title="Feels Like"
        location={locationData.name} colorGradient={tempColorGradient} labelCallback={labelCallback}
        iconCallback={imageCallback} gradientCallback={gradientCallback} dataCallback={dataCallback}
        uniqueName={uniqueName}>

    </WeatherGraph>
{:else}
    <h2>Loading OpenMeteo data...</h2>
{/if}