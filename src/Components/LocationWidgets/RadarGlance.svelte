<script>
    let { locationData, page=$bindable() } = $props();

    let randomId = Math.floor(Math.random() * 1000000);

    let map;

    let refreshRadar = () => {
        if (map){
            map.remove();
        }

        let lat;
        let lon;

        if (locationData.name === "Current Location"){
            lat = window.currentLat;
            lon = window.currentLong;
        }
        else{
            lat = locationData.nominatim.lat;
            lon = locationData.nominatim.lon;
        }

        map = L.map('location-radar-' + String(randomId), { zoomControl: false }).setView([lat, lon], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        // Disable map controls
        map.dragging.disable();
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable();
        map.boxZoom.disable();
        map.keyboard.disable();
        if (map.tap) map.tap.disable();

        setTimeout(function(){
            map.invalidateSize(true);
            passRadarMap(map);
            setTimeout(loadRadarData, 1000);
            setTimeout(playRadarAnimation, 5000);
            passScreen("radar");
        }, 2000);
    }


    setTimeout(refreshRadar, 200);
</script>


<h2>Radar Preview</h2>
<div id="location-radar-{randomId}">
</div>
<button onclick={()=>{
    let locationNames = JSON.parse(localStorage.getItem("weather-location-names"));
    let locationIndex = locationNames.indexOf(locationData.name);
    setTimeout(()=>{
        radarJumpTo(locationIndex)
    }, 5000);
    page="radar";
}}>Go To Radar Page</button>

<style>
    div {
        min-height: 350px;
        border-radius: 7px;
    }

    button {
        width: 100%;
        background-color: darkslategray;
        color: white;
        border: none;
        border-radius: 7px;
        cursor: pointer;
        font-size: 20px;
        font-family: Secular One, sans-serif;
        margin-top: 7px;
        margin-bottom: 7px;
    }
</style>