<script>
    import WeatherGraph from "./WeatherGraph.svelte";

    let { uniqueName, locationData } = $props();

    let chartList = $derived(locationData["hourly"][0]);

    const windColorGradient = chroma.scale(["white", "deeppink"]);

    let labelCallback = (item) =>`${item.dataset.label}: ${item.formattedValue} mph`;

    let lastImage = "";

    let imageCallback = (data, i) => {
        if (data[i]["windDirection"] !== "") {
            lastImage = "directions/"+data[i]["windDirection"];
            return "directions/"+data[i]["windDirection"];
        }
        return lastImage;
    }

    let gradientCallback = (data, i) => Number(data[i]["windSpeed"].replace(" mph", ""))/25;

    let dataCallback = (data, i) => Number(data[i]["windSpeed"].replace(" mph", ""));
</script>

<WeatherGraph chartList={chartList} title="Wind Speed"
    location={locationData.name} colorGradient={windColorGradient} labelCallback={labelCallback}
    iconCallback={imageCallback} gradientCallback={gradientCallback} dataCallback={dataCallback}
    uniqueName={uniqueName} startAtZero={true}>

</WeatherGraph>