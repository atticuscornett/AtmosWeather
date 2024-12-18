/*
    rainweather-api.js
    Weather radar page functions
    Largely based on RainWeather API Example Code
    https://github.com/rainviewer/rainviewer-api-example/blob/master/rainviewer-api-example.html
*/

let radarData = {};
let radarFrames = [];
let radarLayers = [];
let spcOutlookLayer;
let radarTileSize = 256;
let smoothRadarData = 1;
let radarColorScheme = 4;
let radarSnowColors = 1;
let radarAnimPos = 0;
let radarKind = "radar";
let loadingTilesCount = 0;
let loadedTilesCount = 0;
let animationPosition = 0;
let lastPastFramePosition = -1;
let playingRadar = true;
let outlookLink = "https://mapservices.weather.noaa.gov/vector/rest/services/outlooks/SPC_wx_outlks/MapServer/";
let lastRenderedDynamic = "";
let radarMap;
let screenAt;

function passScreen(screen){
    screenAt = screen;
}

function passRadarMap(map){
    radarMap = map;
}

function loadRadarData(){
    let apiRequest = new XMLHttpRequest();
    apiRequest.open("GET", "https://api.rainviewer.com/public/weather-maps.json", true);
    apiRequest.onload = function(e) {
        // store the API response for re-use purposes in memory
        radarData = JSON.parse(apiRequest.response);
        initialize(radarData, radarKind);
    };
    apiRequest.send();
}

function radarJumpTo(index){
    if (index === -1) {
        radarMap.invalidateSize(true);
        radarMap.setView([window.currentLat, window.currentLong], 12);
        return;
    }
    radarMap.invalidateSize(true);
    let locations = JSON.parse(localStorage.getItem("weather-locations"))
    radarMap.setView([parseFloat(locations[index]["lat"]), parseFloat(locations[index]["lon"])], 12)
}

function initialize(api, kind) {
    let settings = JSON.parse(localStorage.getItem("atmos-settings"));
    radarColorScheme = settings["radar"]["color-scheme"];
    if (settings["radar"]["satellite"]){
        radarKind = "satellite";
        kind = "satellite";
    }
    else{
        radarKind = "radar";
        kind = "radar";
    }
    // remove all already added tiled layers
    for (let i in radarLayers) {
        radarMap.removeLayer(radarLayers[i]);
    }
    radarFrames = [];
    radarLayers = [];
    animationPosition = 0;

    if (spcOutlookLayer){
        spcOutlookLayer.remove()
    }

    spcOutlookLayer = L.esri
        .dynamicMapLayer({
          url: outlookLink
        });
    spcOutlookLayer.setOpacity(0.4);
    spcOutlookLayer.addTo(radarMap);
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
    redrawSPCOutlook();

    if (!api) {
        return;
    }
    if (kind == 'satellite' && api.satellite && api.satellite.infrared) {
        radarFrames = api.satellite.infrared;

        lastPastFramePosition = api.satellite.infrared.length - 1;
        showFrame(lastPastFramePosition, true);
    }
    else if (api.radar && api.radar.past) {
        radarFrames = api.radar.past;
        if (api.radar.nowcast) {
            radarFrames = radarFrames.concat(api.radar.nowcast);
        }

        // show the last "past" frame
        lastPastFramePosition = api.radar.past.length - 1;
        showFrame(lastPastFramePosition, true);
    }
}

function showFrame(nextPosition, force) {
    let preloadingDirection = nextPosition - animationPosition > 0 ? 1 : -1;

    changeRadarPosition(nextPosition, false, force);

    // preload next next frame (typically, +1 frame)
    // if don't do that, the animation will be blinking at the first loop
    changeRadarPosition(nextPosition + preloadingDirection, true);
}

function changeRadarPosition(position, preloadOnly, force) {
    if (radarFrames.length < 1){
        return;
    }
    while (position >= radarFrames.length) {
        position -= radarFrames.length;
    }
    while (position < 0) {
        position += radarFrames.length;
    }

    let currentFrame = radarFrames[animationPosition];
    let nextFrame = radarFrames[position];

    addLayer(nextFrame);

    // Quit if this call is for preloading only by design
    // or some times still loading in background
    if (preloadOnly || (isTilesLoading() && !force)) {
        return;
    }

    animationPosition = position;

    if (radarLayers[currentFrame.path]) {
        radarLayers[currentFrame.path].setOpacity(0);
    }
    radarLayers[nextFrame.path].setOpacity(Number(document.getElementById("radar-opacity").value)/100);


    let pastOrForecast = nextFrame.time > Date.now() / 1000 ? 'FORECAST' : 'PAST';

    document.getElementById("radar-time").innerHTML = pastOrForecast + ': ' + (new Date(nextFrame.time * 1000)).toString();
}

function redrawSPCOutlook(){
    if (!spcOutlookLayer._currentImage || lastRenderedDynamic === spcOutlookLayer._currentImage._url){
        document.getElementById("spc-outlook-loading").hidden = false;
        spcOutlookLayer.redraw();
        setTimeout(redrawSPCOutlook, 1000);
        return;
    }
    document.getElementById("spc-outlook-loading").hidden = true;
    lastRenderedDynamic = spcOutlookLayer._currentImage._url;
}

function addLayer(frame) {
    if (!radarLayers[frame.path]) {
        let colorScheme = radarKind == 'satellite' ? 0 : radarColorScheme;
        let smooth = radarKind == 'satellite' ? 0 : smoothRadarData;
        let snow = radarKind == 'satellite' ? 0 : radarSnowColors;

        let source = new L.TileLayer(radarData.host + frame.path + '/' + radarTileSize + '/{z}/{x}/{y}/' + colorScheme + '/' + smooth + '_' + snow + '.png', {
            tileSize: 256,
            zIndex: frame.time
        });
        // Track layer loading state to not display the overlay 
        // before it will completelly loads
        source.on('loading', startLoadingTile);
        source.on('load', finishLoadingTile); 
        source.on('remove', finishLoadingTile);
        source.setOpacity(Number(document.getElementById("radar-opacity").value)/100);
        radarLayers[frame.path] = source;
    }
    if (!radarMap.hasLayer(radarLayers[frame.path])) {
        radarMap.addLayer(radarLayers[frame.path]);
    }
}

function startLoadingTile() {
    loadingTilesCount++;    
}

function finishLoadingTile() {
    setTimeout(function() { loadedTilesCount++; }, 250);
}

function isTilesLoading() {
    return loadingTilesCount > loadedTilesCount;
}

function playRadarAnimation(){
    if (screenAt == "radar"){
        if (playingRadar){
            showFrame(animationPosition + 1);
        }
        setTimeout(playRadarAnimation, 400);
    }
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