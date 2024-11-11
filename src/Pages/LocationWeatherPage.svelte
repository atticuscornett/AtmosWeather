<script>
    import TabSlot from "../Layout/TabSlot.svelte";
    import AlertBar from "../Components/LocationWidgets/AlertBar.svelte";
    import LocationAtAGlance from "../Components/LocationWidgets/LocationAtAGlance.svelte";

    let { locationData, page=$bindable() } = $props();

    $effect(() => {
        console.log("locationData");
        console.log(locationData);
    })
</script>
<TabSlot name="location-{locationData.name}" bind:page={page}>
    <h1>{locationData.name}</h1>
    <br>

    <!-- Wait for weather data -->
    {#if locationData.hourly[0]}
        <AlertBar locationData={locationData} bind:page={page} />
        <LocationAtAGlance locationData={locationData} bind:page={page} />
    {/if}
</TabSlot>