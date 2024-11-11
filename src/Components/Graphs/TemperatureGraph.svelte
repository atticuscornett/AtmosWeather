<script>
    import WeatherGraph from "./WeatherGraph.svelte";

    let { uniqueName, locationData } = $props();

    let chartList = $derived(locationData["hourly"][0]);

    const tempColorGradient = chroma.scale(['purple', 'dodgerblue', 'lime', 'yellow', 'red']);

    let labelCallback = (item) =>`${item.dataset.label}: ${item.formattedValue} °F`;

    let imageCallback = (data, i) => {
        console.log(data)
        let image;
        let sfor = data[i]["shortForecast"].toLowerCase();
        if (sfor.includes("rain") || sfor.includes("drizzle")){
            image = "rainy";
        }
        else if (sfor.includes("tornado") || sfor.includes("storm") || sfor.includes("water spout")){
            image = "stormy";
        }
        else if (sfor.includes("snow")){
            image = "snowy";
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