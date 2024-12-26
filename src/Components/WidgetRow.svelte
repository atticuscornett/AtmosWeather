<script>
    import LocationAtAGlance from "./LocationWidgets/LocationAtAGlance.svelte";
    import AirQualityIndex from "./LocationWidgets/AirQualityIndex.svelte";
    import GraphSwitcher from "./LocationWidgets/GraphSwitcher.svelte";
    import LongNWSForecast from "./LocationWidgets/LongNWSForecast.svelte";
    import WidgetPicker from "./WidgetPicker.svelte";
    import CapeGraph from "./Graphs/CapeGraph.svelte";
    import Next15Minutes from "./LocationWidgets/Next15Minutes.svelte";

    let { locationData, widgets, editing, rowIndex, widgetLayout=$bindable(), page=$bindable() } = $props();

    let addingWidget = $state(false);

    function removeWidgetRow(){
        widgetLayout.splice(rowIndex, 1);
    }
</script>


<div class="widgetRow">
    {#each widgets as widget}
        <div class="widgetContainer">
            {#if widget === "LocationAtAGlance"}
                <LocationAtAGlance locationData={locationData} bind:page={page} />
            {/if}
            {#if widget === "AirQualityIndex"}
                <AirQualityIndex locationData={locationData} />
            {/if}
            {#if widget === "GraphSwitcher"}
                <GraphSwitcher locationData={locationData} />
            {/if}
            {#if widget === "LongNWSForecast"}
                <LongNWSForecast locationData={locationData} />
            {/if}
            {#if widget === "CAPEGraph"}
                <CapeGraph locationData={locationData} uniqueName="CAPE-{locationData.name}"/>
            {/if}
            {#if widget === "Next15Minutes"}
                <Next15Minutes locationData={locationData} />
            {/if}

        </div>
    {/each}
    {#if editing}
        <button class="editButton" onclick={()=>{addingWidget=true;}}>Add Widget</button>
        <button class="editButton" onclick={removeWidgetRow}>Remove Row</button>
    {/if}
    {#if addingWidget}
        <WidgetPicker bind:addingWidget={addingWidget} widgetRow={rowIndex} bind:widgetLayout={widgetLayout} bind:locationData={locationData} />
    {/if}

</div>

<style>
    .widgetRow {
        display: flex;
        overflow: auto;
        margin-bottom: 10px;
    }

    .widgetContainer {
        flex: 10;
        margin-right: 10px;
    }

    .editButton {
        margin-bottom: 10px;
        flex: 0.5;
        min-width: auto;
        background-color: darkslategray;
        border: white dashed 5px;
        margin-right: 10px;
        border-radius: 7px;
        color: white;
        font-weight: bold;
        min-height: 75px;
        cursor: pointer;

    }
</style>