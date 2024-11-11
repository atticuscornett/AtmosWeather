<script>
    import TabSlot from "../Layout/TabSlot.svelte";
    import AlertBar from "../Components/LocationWidgets/AlertBar.svelte";

    let { locationData, page=$bindable() } = $props();

    $effect(() => {
        console.log("locationData");
        console.log(locationData);
    })
</script>
<TabSlot name="location-{locationData.name}" bind:page={page}>
    <h1>{locationData.name}</h1>
    <br>
    <AlertBar locationData={locationData} bind:page={page} />
</TabSlot>