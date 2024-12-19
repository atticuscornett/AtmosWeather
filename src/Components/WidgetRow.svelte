<script>
    import LocationAtAGlance from "./LocationWidgets/LocationAtAGlance.svelte";
    import AirQualityIndex from "./LocationWidgets/AirQualityIndex.svelte";
    import GraphSwitcher from "./LocationWidgets/GraphSwitcher.svelte";
    import LongNWSForecast from "./LocationWidgets/LongNWSForecast.svelte";
    import WidgetPicker from "./WidgetPicker.svelte";

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
        </div>
    {/each}
    {#if editing}
        <button onclick={()=>{addingWidget=true;}}>Add Widget</button>
        <button onclick={removeWidgetRow}>Remove Row</button>
    {/if}
    {#if addingWidget}
        <WidgetPicker bind:addingWidget={addingWidget} widgetRow={rowIndex} bind:widgetLayout={widgetLayout} />
    {/if}

</div>

<style>
    .widgetRow {
        display: flex;
        overflow: auto;
        margin-bottom: 10px;
    }

    .widgetContainer {
        flex: 1;
        margin-right: 10px;
    }
</style>