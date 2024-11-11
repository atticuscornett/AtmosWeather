<script>
    import WeatherGraph from "./WeatherGraph.svelte";

    let { uniqueName, locationData } = $props();

    let chartList = $derived(locationData["hourly"][0]);

    const precipColorGradient = chroma.scale(["white", "dodgerblue", "blue"]);

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