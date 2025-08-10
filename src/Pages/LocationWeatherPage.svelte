<script>
    import TabSlot from "../Layout/TabSlot.svelte";
    import AlertBar from "../Components/LocationWidgets/AlertBar.svelte";
    import WidgetRow from "../Components/WidgetRow.svelte";
    import TemplatePicker from "../Components/TemplatePicker.svelte";

    let { locationData, page=$bindable(), alertSelection = $bindable() } = $props();

    let editing = $state(false);
    let widgets = $state();
    let addingTemplate = $state(false);
    let readyToLoad = $state(false);

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

    function saveAsDefaultTemplate(){
        localStorage.setItem("default-widgets", JSON.stringify(widgetLayout));
        widgetLayout = ["Template:default"];
        refreshWidgets();

        toggleEdit();
    }

    function toggleEdit(){
        if (editing){
            widgets[locationData.name] = widgetLayout;

            if (widgetLayout[widgetLayout.length - 1].length === 1
                && widgetLayout[widgetLayout.length - 1][0].includes("Template:")){

                widgets[locationData.name] = [widgetLayout[widgetLayout.length - 1][0]];
            }

            widgets["default"] = JSON.parse(localStorage.getItem("default-widgets"));

            localStorage.setItem("widgets", JSON.stringify(widgets));
        }
        else {
            // Disable template upon editing
            if (widgetLayout[widgetLayout.length - 1].length === 1
                && widgetLayout[widgetLayout.length - 1][0].includes("Template:")){
                widgetLayout.pop();
            }
        }

        editing = !editing;
    }

    let widgetLayout = $state([["LocationAtAGlance"], ["AirQualityIndex"], ["GraphSwitcher"], ["LongNWSForecast"]]);

    function refreshWidgets(){
        if (localStorage.getItem("widgets") === null){
            localStorage.setItem("widgets", "{}");
        }

        widgets = JSON.parse(localStorage.getItem("widgets"));

        widgets["default"] = JSON.parse(localStorage.getItem("default-widgets"));

        if (widgets["default"] === null){
            widgets["default"] = [["LocationAtAGlance"], ["AirQualityIndex"], ["GraphSwitcher"], ["LongNWSForecast"]];
            localStorage.setItem("default-widgets", JSON.stringify(widgets["default"]));
        }

        if (widgets[locationData.name] === undefined){
            widgets[locationData.name] = ["Template:default"];
        }

        let templates = window.widgetTemplates;

        widgetLayout = widgets[locationData.name];

        // If the widget layout is a template, replace it with the template's layout.
        if (widgetLayout[0].includes("Template:")){
            let templateCode = widgetLayout[0];
            widgetLayout = templates[templateCode.replace("Template:", "")];
            widgetLayout.push([templateCode]);
        }


        if (locationData.name === "Current Location" && !locationData.hourly[0]){
            refreshLocations()
        }
        readyToLoad = true;
    }

    $effect(()=>{
        if (readyToLoad && page !== "location-" + locationData.name){
            readyToLoad = false;
        }
    })


</script>
<TabSlot name="location-{locationData.name}" bind:page={page} onOpen={refreshWidgets}>
    {#if readyToLoad}
    <h1>{locationData.name}</h1>
    <br>

    <!-- Wait for weather data -->
    {#if locationData.hourly[0]}
        <AlertBar locationData={locationData} bind:page={page} bind:alertSelection={alertSelection}/>
        {#each widgetLayout as widgetRow, i}
            <WidgetRow bind:locationData={locationData} widgets={widgetRow} editing={editing} bind:page={page} rowIndex={i} bind:widgetLayout={widgetLayout}/>
            {#if editing && (widgetRow.length !== 1 || !widgetRow[0].includes("Template:"))}
                <button onclick={addRow.bind(null, i)} class="largerMargin">Add Row</button>
            {/if}
        {/each}

        {#if widgetLayout.length === 0 && editing}
            <button onclick={addRow.bind(null, -1)} class="largerMargin">Add Row</button>
        {/if}

        {#if editing}
            <button onclick={()=>{addingTemplate=true;}}>Use a Template</button>
        {/if}

        {#if addingTemplate}
            <TemplatePicker bind:addingTemplate={addingTemplate}
                            bind:widgets={widgets} bind:locationData={locationData}
                            bind:widgetLayout={widgetLayout}
                            bind:toggleEdit={toggleEdit}
                            refreshWidgets={refreshWidgets}/>
        {/if}

        <button onclick={toggleEdit}>{editing ? "Save This Page" : "Edit This Page"}</button>

        {#if editing}
            <button onclick={saveAsDefaultTemplate}>Save Page as Default for All Locations</button>
        {/if}

        <br>

        {#if locationData.name !== "Current Location"}
            <button onclick={removeLocation}>Remove This Location</button>
        {/if}
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