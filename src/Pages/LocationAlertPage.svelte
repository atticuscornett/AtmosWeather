<script>
    import TabSlot from "../Layout/TabSlot.svelte";
    import {onMount} from "svelte";

    let { locationData, alertID, page=$bindable() } = $props();
    let map;
    onMount(()=>{
        map = L.map('alert-map').setView([33.543682, -86.8104], 13);
    })

    let alert = $state(false);

    $effect(() => {
        if (locationData.alerts){
            console.log(locationData.alerts);
            console.log(alertID);
            if (locationData.alerts[alertID]){
                console.log(locationData.alerts[alertID]);
                alert = locationData.alerts[alertID];

                let details = alert["properties"]["description"];
                details = details.replaceAll("\n\n", "<br><br>");
                details = details.replaceAll("\n", " ");
                details = details.replaceAll("* ", "");
                details = details.replaceAll("...", " - ");
                details = details.replaceAll("- -", "-");
                details = details.split("<br><br>");
                alert["properties"]["descriptionSplit"] = details;
            }
        }
    })

    function loadAlert(alertID){
        clearMap();
        getPolyBoundariesAsync(alertData, (alertBoundaries) => {
            document.getElementById("weather-alert-title").innerHTML = theAlert["properties"]["headline"];
            var divCode = "<h2>Areas Affected</h2>"
            divCode += "<h3>" + theAlert["properties"]["areaDesc"] + "</h3>"
            if (theAlert["properties"]["instruction"] != null){
                divCode += "<h2>Instructions</h2>"
                divCode += "<h3>" + theAlert["properties"]["instruction"] + "</h3>"
            }
            divCode += "<h2>Details</h2>"
            var theDetails = theAlert["properties"]["description"]
            theDetails = theDetails.replaceAll("\n\n", "<br><br>");
            theDetails = theDetails.replaceAll("\n", " ");
            theDetails = theDetails.replaceAll("* ", "");
            theDetails = theDetails.replaceAll("...", " - ");
            theDetails = theDetails.replaceAll("- -", "-")
            divCode += "<h3>" + theDetails + "</h3>"
            document.getElementById("alert-details").innerHTML = divCode;
            var styling;
            if (theAlert["properties"]["event"].toLowerCase().includes("warning")){
                styling = {"color":"red"};
            }
            else if (theAlert["properties"]["event"].toLowerCase().includes("watch")){
                styling = {"color":"yellow"};
            }
            else{
                styling = {"color":"blue"};
            }
            console.log(alertBoundaries);
            navTo("alert-display")
            setTimeout(function(){
                let polygon = L.geoJSON(alertBoundaries, {style:styling});
                polygon.addTo(map);
                console.log(alertBoundaries);
                console.log(polygon);
                map.invalidateSize(true)
                setTimeout(function(){
                    map.fitBounds(polygon.getBounds());
                }, 1000);
            }, 1000)
        });

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