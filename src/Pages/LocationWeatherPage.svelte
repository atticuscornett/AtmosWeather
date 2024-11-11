<script>
    import TabSlot from "../Layout/TabSlot.svelte";
    import AlertBar from "../Components/LocationWidgets/AlertBar.svelte";
    import LocationAtAGlance from "../Components/LocationWidgets/LocationAtAGlance.svelte";
    import AirQualityIndex from "../Components/LocationWidgets/AirQualityIndex.svelte";
    import MultiGraph from "../Components/LocationWidgets/MultiGraph.svelte";
    import LongNWSForecast from "../Components/LocationWidgets/LongNWSForecast.svelte";

    let { locationData, page=$bindable(), alertSelection = $bindable() } = $props();

    $effect(() => {
        console.log("locationData");
        console.log(locationData);
    })

    function removeLocation(){
        let locations = JSON.parse(localStorage.getItem("weather-locations"));
        let locationNames = JSON.parse(localStorage.getItem("weather-location-names"));
        let name = locationData.name;
        // Disable the remove location button to prevent accidental double taps causing multiple locations to be removed.
        let index = locationNames.indexOf(name);
        if (index === -1){
            return;
        }
        locationNames.splice(index, 1);
        locations.splice(index, 1);
        localStorage.setItem("weather-locations", JSON.stringify(locations));
        localStorage.setItem("weather-location-names", JSON.stringify(locationNames));
        page = "locations";
    }
</script>
<TabSlot name="location-{locationData.name}" bind:page={page}>
    <h1>{locationData.name}</h1>
    <br>

    <!-- Wait for weather data -->
    {#if locationData.hourly[0]}
        <AlertBar locationData={locationData} bind:page={page} bind:alertSelection={alertSelection}/>
        <LocationAtAGlance locationData={locationData} bind:page={page} />
        <AirQualityIndex locationData={locationData} />
        <MultiGraph locationData={locationData} />
        <LongNWSForecast locationData={locationData} />
        <button onclick={removeLocation}>Remove This Location</button>
    {/if}
</TabSlot>

<style>
    button {
        width:100%;
        cursor:pointer;
        background-color:darkslategray;
        color:white;border:none;
        border-radius:7px;
        font-size:20px;
        font-family:Secular One, sans-serif;
    }
</style>