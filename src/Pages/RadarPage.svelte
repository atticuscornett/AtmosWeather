<script>
import TabSlot from "../Layout/TabSlot.svelte";

let { page = $bindable() } = $props();

let settings = $state(JSON.parse(localStorage.getItem("atmos-settings")));
let locationNames = JSON.parse(localStorage.getItem("weather-location-names"));
let locationAvailable = $state(false);

let map;

$effect(() => {
    passScreen(page);
})

let refreshRadar = () => {
    settings = JSON.parse(localStorage.getItem("atmos-settings"));
    locationNames = JSON.parse(localStorage.getItem("weather-location-names"));

    locationAvailable = window.currentLat;

    if (map){
        map.remove();
    }
    map = L.map('radar-map').setView([40.58207622, -95.461760283], 3);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    setTimeout(function(){
        map.invalidateSize(true);
        passRadarMap(map);
        setTimeout(loadRadarData, 1000);
        setTimeout(playRadarAnimation, 5000);
        var polygon;
        setTimeout(function(){
            getAllActiveAlertsAsync(
                (alerts) => {
                    alerts = sortByEventType(alerts);
                    slowLoadPolygons(alerts, 0);
                }
            );
        }, 5000)
    }, 2000);
}
</script>

<TabSlot name="radar" bind:page={page} onOpen={refreshRadar}>
    <h1>Radar</h1>
    <div id="radar-map">
    </div>
    <h5 id="polygon-load-count" hidden></h5>
    <h5 id="spc-outlook-loading" hidden>Loading SPC outlook...</h5>
    <h6 id="radar-time"></h6>
    <div class="flexSettings">
        <div class="radarSettings">
            <label>Radar Transparency</label>
            <br>
            <input type="range" min="1" max="100" value="85" class="slider" id="radar-opacity">
        </div>
        <div class="radarButtonContainer">
            <button id="radar-animation-control" onclick={toggleRadarPlayback}>Pause ⏸️</button>
        </div>
    </div>
    <div class="radarSettings" id="spc-select-container">
        <label>Weather Outlook Type</label>
        <br>
        <select id="spc-select" onchange={changeWeatherOutlook}>
            <option value="severe-outlook">Severe Weather Outlook</option>
            <option value="fire-outlook">Fire Outlook</option>
            <option value="hazards-outlook">Hazards Outlook</option>
        </select>
    </div>
    <h3>Jump To Location</h3>
    <div id="radar-locations">
        {#if locationAvailable}
            <h2 onclick={radarJumpTo(-1)}><a href='#'>Current Location</a></h2>
        {/if}
        {#each locationNames as location, i}
            <h2 onclick={radarJumpTo.bind(false, i)}><a href='#'>{location}</a></h2>
        {/each}
        {#if locationNames.length === 0 && !locationAvailable}
            <h2>You don't have any locations yet!</h2>
        {/if}
    </div>
</TabSlot>

<style>
    #radar-map {
        height:65%;
        border-radius:7px;
        box-shadow: 0 0 7px #898989;
    }

    label {
        font-size: 15px;
    }

    .radarSettings {
        text-align: center;
        width:fit-content;
        display: inline-block;
        margin-right: 20px;
        margin-top:15px;
    }

    .radarButtonContainer {
        text-align: center;
        width:fit-content;
        display: inline-block;
        margin-right: 10px;
    }

    .flexSettings {
        display: flex;
        align-items:center;
    }

    #radar-animation-control{
        background-color: dodgerblue;
        color: white;
        font-size: 20px;
        border-radius: 7px;
        cursor: pointer;
        border: none;
        font-family: Secular One, sans-serif;
    }

    select {
        font-size: 15px;
    }
</style>