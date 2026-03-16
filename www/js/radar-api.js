/*
    radar-api.js
    NWS Weather Radar Imagery and SPC Outlooks
*/

let spcOutlookLayer;
let animationPosition = 0;
let playingRadar = true;
let outlookLink = "https://mapservices.weather.noaa.gov/vector/rest/services/outlooks/SPC_wx_outlks/MapServer/";
let lastRenderedDynamic = "";
let radarMap;
let screenAt;
let baseRadar = null;
let radarParams = {
    layers: '0',
    format: 'image/png',
    transparent: true,
    attribution: "NOAA/NWS"
};

function passScreen(screen){
    screenAt = screen;
}

function passRadarMap(map){
    radarMap = map;
}

function loadRadarData(relativeTime = 0){
    // Load latest reflectivity maps
    if (baseRadar !== null){
        radarMap.removeLayer(baseRadar);
    }

    baseRadar = L.esri.imageMapLayer({
        url: "https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer" // Example service URL
    }).addTo(radarMap);

    baseRadar.setTimeRange(Date.now() - relativeTime - 10 * 60 * 1000, Date.now() - relativeTime);
    baseRadar.setZIndex(1);


    // Load SPC outlooks
    if (spcOutlookLayer){
        spcOutlookLayer.remove()
    }
    let settings = JSON.parse(localStorage.getItem("atmos-settings"));

    spcOutlookLayer = L.esri
        .dynamicMapLayer({
            url: outlookLink
        });
    spcOutlookLayer.setOpacity(0.4);
    spcOutlookLayer.addTo(radarMap);
    spcOutlookLayer.setZIndex(10);

    if (!settings["radar"]["spc-outlook"]){
        spcOutlookLayer.remove();
        document.getElementById("spc-select-container").style.display = "none";
    }
    else{
        document.getElementById("spc-select-container").style.display = "inline-block";
    }

    radarMap.on("moveend", ()=>{
        if (settings["radar"]["spc-outlook"]){
            redrawSPCOutlook();
        }
    });
}

function setRadarTime(relativeTime){
    if (baseRadar == null){
        return;
    }
    baseRadar.setTimeRange(Date.now() - relativeTime - 10 * 60 * 1000, Date.now() - relativeTime);
}

function setRadarTransparency(t){
    if (baseRadar == null){
        return;
    }
    baseRadar.setOpacity(t/100);
}

function radarJumpTo(index){
    radarMap.invalidateSize(true);
    if (index === -1) {
        radarMap.invalidateSize(true);
        radarMap.setView([window.currentLat, window.currentLong], 12);
        return;
    }
    let locations = JSON.parse(localStorage.getItem("weather-locations"))
    radarMap.setView([parseFloat(locations[index]["lat"]), parseFloat(locations[index]["lon"])], 12)
}

function redrawSPCOutlook(){
    if (!spcOutlookLayer._currentImage || lastRenderedDynamic === spcOutlookLayer._currentImage._url){
        document.getElementById("spc-outlook-loading").hidden = false;
        spcOutlookLayer.redraw();
        spcOutlookLayer.setZIndex(10);
        baseRadar.setZIndex(1);
        setTimeout(redrawSPCOutlook, 1000);
        return;
    }
    document.getElementById("spc-outlook-loading").hidden = true;
    lastRenderedDynamic = spcOutlookLayer._currentImage._url;
}

function toggleRadarPlayback(){
    if (playingRadar){
        playingRadar = false;
        document.getElementById("radar-animation-control").innerHTML = "Play ▶️";
    }
    else{
        playingRadar = true;
        document.getElementById("radar-animation-control").innerHTML = "Pause ⏸️";
    }
}

function slowLoadPolygons(alerts, index){
    if (screenAt != "radar"){
        return;
    }
    let a = index;
    while(a < index + 10 && a < alerts[0].length){
        let styling = {"color":"blue"};
        let eventLowered = alerts[0][a]["properties"]["event"].toLowerCase();
        if (eventLowered.includes("warning")){
            styling = {"color":"red"};
        }
        if (eventLowered.toLowerCase().includes("watch")){
            styling = {"color":"yellow"};
        }
        if (eventLowered.includes("advisory") || eventLowered.includes("marine") || eventLowered.includes("rip current") || eventLowered.includes("gale")  || eventLowered.includes("beach") || eventLowered.includes("coast") || eventLowered.includes("seas")){
            a++;
            continue;
        }
        let x = 0;
        let alertBoundaries = getPolyBoundariesAsync(alerts[0][a], (alertBoundaries, a) => {
            polygon = L.geoJSON(alertBoundaries, {style:styling}).addTo(radarMap);
            polygon.bindPopup(alerts[0][a]["properties"]["headline"]);
        }, a);
        a++;
    }
    document.getElementById("polygon-load-count").innerHTML = "Loading alert polygons... (" + Math.floor(((a+1)/alerts[0].length)*100) + "%)";
    document.getElementById("polygon-load-count").hidden = false;
    if (a < alerts[0].length){
        setTimeout(function(){slowLoadPolygons(alerts, a)}, 500);
    }
    else{
        document.getElementById("polygon-load-count").hidden = true;
    }
}

function reloadOutlook(){
    if (spcOutlookLayer){
        spcOutlookLayer.remove()
    }

    spcOutlookLayer = L.esri
        .dynamicMapLayer({
          url: outlookLink
        });
    spcOutlookLayer.setOpacity(0.4);
    spcOutlookLayer.addTo(radarMap);
    redrawSPCOutlook();
}

function changeWeatherOutlook(){
    let value = document.getElementById("spc-select").value;
    if (value == "severe-outlook"){
        outlookLink = "https://mapservices.weather.noaa.gov/vector/rest/services/outlooks/SPC_wx_outlks/MapServer/";
    }
    else if (value == "fire-outlook"){
        outlookLink = "https://mapservices.weather.noaa.gov/vector/rest/services/fire_weather/SPC_firewx/MapServer";
    }
    else{
        outlookLink = "https://mapservices.weather.noaa.gov/vector/rest/services/hazards/cpc_weather_hazards/MapServer";
    }
    reloadOutlook();
}