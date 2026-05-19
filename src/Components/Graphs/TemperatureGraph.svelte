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

    const tempColorGradient = chroma.scale([startGradientColor, gradientColor2,
        gradientColor3, gradientColor4, endGradientColor]);

    let labelCallback = (item) =>`${item.dataset.label}: ${item.formattedValue} °F`;

    let imageCallback = (data, i) => {
        let image;
        let sfor = data[i]["shortForecast"].toLowerCase();

        if (sfor.includes("tornado") || sfor.includes("storm") || sfor.includes("water spout")){
            image = "stormy";
        }
        else if (sfor.includes("snow")){
            image = "snowy";
        }
        else if (sfor.includes("rain") || sfor.includes("drizzle")){
            image = "rainy";
        }
        else if (sfor.includes("wind")){
            image = "windy";
        }
        else if (sfor.includes("cloud") || sfor.includes("fog")){
            image = "cloudy";
        }
        else{
            image = "sunny";
        }
        return image;
    }

    let gradientCallback = (data, i) => data[i]["temperature"]/100;

    let dataCallback = (data, i) => data[i]["temperature"];
</script>

<WeatherGraph chartList={chartList} title="Forecast Temperature"
    location={locationData.name} colorGradient={tempColorGradient} labelCallback={labelCallback}
    iconCallback={imageCallback} gradientCallback={gradientCallback} dataCallback={dataCallback}
    uniqueName={uniqueName}>

</WeatherGraph>