<script>
    import TabSlot from "../Layout/TabSlot.svelte";
    import {onMount} from "svelte";

    let { locationData, alertID, page=$bindable() } = $props();
    let map;

    // Initializes the LeafletJS alert map with OpenStreetMap tiles
    onMount(()=>{
        map = L.map('alert-map').setView([33.543682, -86.8104], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);
    })

    let alert = $state(false);

    $effect(() => {
        if (locationData.alerts){
            clearMap();

            if (locationData.alerts[alertID]){
                alert = locationData.alerts[alertID];

                // Formats the alert details for display
                let details = alert["properties"]["description"];
                details = details.replaceAll("\n\n", "<br><br>");
                details = details.replaceAll("\n", " ");
                details = details.replaceAll("* ", "");
                details = details.replaceAll("...", " - ");
                details = details.replaceAll("- -", "-");
                details = details.split("<br><br>");
                alert["properties"]["descriptionSplit"] = details;

                // Styles the alert polygon based on the event type
                let styling;
                if (alert["properties"]["event"].toLowerCase().includes("warning")){
                    styling = {"color":"red"};
                }
                else if (alert["properties"]["event"].toLowerCase().includes("watch")){
                    styling = {"color":"yellow"};
                }
                else{
                    styling = {"color":"blue"};
                }

                // Adds the alert polygon to the LeafletJS alert map
                getPolyBoundariesAsync(alert, (alertBoundaries)=>{
                    setTimeout(function(){
                        let polygon = L.geoJSON(alertBoundaries, {style:styling});
                        polygon.addTo(map);
                        map.invalidateSize(true)
                        setTimeout(function(){
                            map.fitBounds(polygon.getBounds());
                        }, 1000);
                    }, 1000);
                });
            }
        }
    })

    // Clears polygons from the LeafletJS alert map
    function clearMap() {
        for(let i in map._layers) {
            if(map._layers[i]._path != undefined) {
                try {
                    map.removeLayer(map._layers[i]);
                }
                catch(e) {
                    console.log("Error removing " + e + map._layers[i]);
                }
            }
        }
    }

</script>

<TabSlot name="alert-view" bind:page={page}>
    {#if alert}
        <h1 id="weather-alert-title">{alert["properties"]["headline"]}</h1>
    {/if}

    <div id="alert-map">
    </div>

    {#if alert}
        <div id="alert-details">
            <h2>Areas Affected</h2>
            <h3>{alert["properties"]["areaDesc"]}</h3>

            {#if alert["properties"]["instruction"]}
                <h2>Instructions</h2>
                <h3>{alert["properties"]["instruction"]}</h3>
            {/if}

            <h2>Details</h2>
            {#each alert["properties"]["descriptionSplit"] as detail}
                <h3>{detail}</h3>
            {/each}
        </div>
    {/if}
</TabSlot>

<style>
    h1 {
        margin-right: 20px;
    }

    #alert-map {
        height:40%;
        border-radius:7px;
        box-shadow: 0 0 7px #898989;
    }

    #alert-details {
        margin-right: 20px;
    }
</style>