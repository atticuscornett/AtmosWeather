<script>
    import WeatherGraph from "./WeatherGraph.svelte";

    let { uniqueName, locationData } = $props();

    let chartList = $derived(locationData["hourly"][0]);

    const root = document.documentElement;
    const startGradientColor = getComputedStyle(root).getPropertyValue('--humidity-graph-start').trim();
    const endGradientColor = getComputedStyle(root).getPropertyValue('--humidity-graph-end').trim();
    const humidColorGradient = chroma.scale([startGradientColor, endGradientColor]);

    let labelCallback = (item) =>`${item.dataset.label}: ${item.formattedValue}%`;

    let imageCallback = (data, i) => {
        return "";
    }

    let gradientCallback = (data, i) => data[i]["relativeHumidity"]["value"]/100;

    let dataCallback = (data, i) => data[i]["relativeHumidity"]["value"];
</script>

<WeatherGraph chartList={chartList} title="Relative Humidity"
    location={locationData.name} colorGradient={humidColorGradient} labelCallback={labelCallback}
    iconCallback={imageCallback} gradientCallback={gradientCallback} dataCallback={dataCallback}
    uniqueName={uniqueName} scale={true}>

</WeatherGraph>