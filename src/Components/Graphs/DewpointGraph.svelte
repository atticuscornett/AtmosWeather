<script>
    import WeatherGraph from "./WeatherGraph.svelte";

    let { uniqueName, locationData } = $props();

    let chartList = $derived(locationData["hourly"][0]);

    const root = document.documentElement;
    const startGradientColor = getComputedStyle(root).getPropertyValue('--temp-graph-start').trim();
    const gradientColor2 = getComputedStyle(root).getPropertyValue('--temp-graph-2').trim();
    const gradientColor3 = getComputedStyle(root).getPropertyValue('--temp-graph-3').trim();
    const gradientColor4 = getComputedStyle(root).getPropertyValue('--temp-graph-4').trim();
    const endGradientColor = getComputedStyle(root).getPropertyValue('--temp-graph-end').trim();



    const dewpointColorGradient = chroma.scale([startGradientColor, gradientColor2,
        gradientColor3, gradientColor4, endGradientColor]);

    let labelCallback = (item) =>`${item.dataset.label}: ${item.formattedValue} °F`;

    let imageCallback = (data, i) => {
        return "";
    }

    let gradientCallback = (data, i) => convertTempUnit(data[i]["dewpoint"]["value"], "C")/100;

    let dataCallback = (data, i) => convertTempUnit(data[i]["dewpoint"]["value"], "C");
</script>

<WeatherGraph chartList={chartList} title="Dew Point"
    location={locationData.name} colorGradient={dewpointColorGradient} labelCallback={labelCallback}
    iconCallback={imageCallback} gradientCallback={gradientCallback} dataCallback={dataCallback}
    uniqueName={uniqueName}>

</WeatherGraph>