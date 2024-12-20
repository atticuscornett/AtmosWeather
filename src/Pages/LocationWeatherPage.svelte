<script>
    import TabSlot from "../Layout/TabSlot.svelte";
    import AlertBar from "../Components/LocationWidgets/AlertBar.svelte";
    import WidgetRow from "../Components/WidgetRow.svelte";

    let { locationData, page=$bindable(), alertSelection = $bindable() } = $props();

    let editing = $state(false);

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

    function addRow(rowIndex){
        widgetLayout.splice(rowIndex + 1, 0, []);
    }

    function toggleEdit(){
        editing = !editing;
    }

    let widgetLayout = $state([["LocationAtAGlance"], ["AirQualityIndex"], ["GraphSwitcher"], ["LongNWSForecast"]]);
</script>
<TabSlot name="location-{locationData.name}" bind:page={page}>
    <h1>{locationData.name}</h1>
    <br>

    <!-- Wait for weather data -->
    {#if locationData.hourly[0]}
        <AlertBar locationData={locationData} bind:page={page} bind:alertSelection={alertSelection}/>
        {#each widgetLayout as widgetRow, i}
            <WidgetRow locationData={locationData} widgets={widgetRow} editing={editing} bind:page={page} rowIndex={i} bind:widgetLayout={widgetLayout}/>
            {#if editing}
                <button onclick={addRow.bind(null, i)} class="largerMargin">Add Row</button>
            {/if}
        {/each}

        {#if widgetLayout.length === 0 && editing}
            <button onclick={addRow.bind(null, -1)} class="largerMargin">Add Row</button>
        {/if}

        <button onclick={toggleEdit}>{editing ? "Save changes" : "Edit this page"}</button>
        <br>

        {#if locationData.name !== "Current Location"}
            <button onclick={removeLocation}>Remove This Location</button>
        {/if}
    {/if}
</TabSlot>

<style>
    button {
        width: 100%;
        cursor: pointer;
        background-color: darkslategray;
        color: white;
        border: none;
        border-radius: 7px;
        font-size: 20px;
        font-family: Secular One, sans-serif;
        margin-top: 7px;
        margin-bottom: 7px;
    }

    .largerMargin {
        margin-bottom: 30px;
    }
</style>