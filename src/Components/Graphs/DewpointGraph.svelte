<script>
    import WeatherGraph from "./WeatherGraph.svelte";

    let { uniqueName, locationData } = $props();

    let chartList = $derived(locationData["hourly"][0]);

    const precipColorGradient = chroma.scale(['purple', 'dodgerblue', 'lime', 'yellow', 'red']);

    let labelCallback = (item) =>`${item.dataset.label}: ${item.formattedValue} °F`;

    let imageCallback = (data, i) => {
        return "";
    }

    let gradientCallback = (data, i) => convertTempUnit(data[i]["dewpoint"]["value"], "C")/100;

    let dataCallback = (data, i) => convertTempUnit(data[i]["dewpoint"]["value"], "C");
</script>

<WeatherGraph chartList={chartList} title="Dew Point"
    location={locationData.name} colorGradient={precipColorGradient} labelCallback={labelCallback}
    iconCallback={imageCallback} gradientCallback={gradientCallback} dataCallback={dataCallback}
    uniqueName={uniqueName}>

</WeatherGraph>