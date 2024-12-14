<script>
    import LocationAtAGlance from "./LocationWidgets/LocationAtAGlance.svelte";
    import AirQualityIndex from "./LocationWidgets/AirQualityIndex.svelte";
    import MultiGraph from "./LocationWidgets/MultiGraph.svelte";
    import LongNWSForecast from "./LocationWidgets/LongNWSForecast.svelte";

    let { locationData, widgets, page=$bindable() } = $props();
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
            {#if widget === "MultiGraph"}
                <MultiGraph locationData={locationData} />
            {/if}
            {#if widget === "LongNWSForecast"}
                <LongNWSForecast locationData={locationData} />
            {/if}
        </div>
    {/each}
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