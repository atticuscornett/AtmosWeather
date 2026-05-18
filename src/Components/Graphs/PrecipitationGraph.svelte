<script>
    import WeatherGraph from "./WeatherGraph.svelte";

    let { uniqueName, locationData } = $props();

    let chartList = $derived(locationData["hourly"][0]);

    const root = document.documentElement;
    const startGradientColor = getComputedStyle(root).getPropertyValue('--precipitation-graph-start').trim();
    const gradientColor2 = getComputedStyle(root).getPropertyValue('--precipitation-graph-2').trim();
    const endGradientColor = getComputedStyle(root).getPropertyValue('--precipitation-graph-end').trim();

    const precipColorGradient = chroma.scale([startGradientColor, gradientColor2, endGradientColor]);

    let labelCallback = (item) =>`${item.dataset.label}: ${item.formattedValue}%`;

    let imageCallback = (data, i) => {
        return "";
    }

    let gradientCallback = (data, i) => data[i]["probabilityOfPrecipitation"]["value"]/100;

    let dataCallback = (data, i) => data[i]["probabilityOfPrecipitation"]["value"];
</script>

<WeatherGraph chartList={chartList} title="Chance of Precipitation"
    location={locationData.name} colorGradient={precipColorGradient} labelCallback={labelCallback}
    iconCallback={imageCallback} gradientCallback={gradientCallback} dataCallback={dataCallback}
    uniqueName={uniqueName} scale={true}>

</WeatherGraph>