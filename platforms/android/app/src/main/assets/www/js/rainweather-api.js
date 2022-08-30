/*
    rainweather-api.js
    Weather radar page functions
    Largely based on RainWeather API Example Code
    https://github.com/rainviewer/rainviewer-api-example/blob/master/rainviewer-api-example.html
*/

var radarData = {};
var radarFrames = [];
var radarLayers = [];
var radarTileSize = 256;
var smoothRadarData = 1;
var radarColorScheme = 4;
var radarSnowColors = 1;
var radarAnimPos = 0;
var radarKind = "radar";
var loadingTilesCount = 0;
var loadedTilesCount = 0;
var animationPosition = 0;
var lastPastFramePosition = -1;
var playingRadar = true;

function loadRadarData(){
    var apiRequest = new XMLHttpRequest();
    apiRequest.open("GET", "https://api.rainviewer.com/public/weather-maps.json", true);
    apiRequest.onload = function(e) {
        // store the API response for re-use purposes in memory
        radarData = JSON.parse(apiRequest.response);
        initialize(radarData, radarKind);
    };
    apiRequest.send();
    var a = 0;
    var locationNames = JSON.parse(localStorage.getItem("weather-location-names"));
    var genCode = "";
    while (a < locationNames.length){
        genCode += "<h2 onclick='radarJumpTo(" + a.toString() + ");'><a href='#'>" + locationNames[a] + "</a></h2>"
        a++;
    }
    if (genCode == ""){
        genCode = "<h2>You don't have any locations yet!</h2>"
    }
    document.getElementById("radar-locations").innerHTML = genCode;
}

function radarJumpTo(index){
    map2.invalidateSize(true);
    var locations = JSON.parse(localStorage.getItem("weather-locations"))
    map2.setView([parseFloat(locations[index]["lat"]), parseFloat(locations[index]["lon"])], 12)
}

function initialize(api, kind) {
    // remove all already added tiled layers
    for (var i in radarLayers) {
        map2.removeLayer(radarLayers[i]);
    }
    radarFrames = [];
    radarLayers = [];
    animationPosition = 0;

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
    var preloadingDirection = nextPosition - animationPosition > 0 ? 1 : -1;

    changeRadarPosition(nextPosition, false, force);

    // preload next next frame (typically, +1 frame)
    // if don't do that, the animation will be blinking at the first loop
    changeRadarPosition(nextPosition + preloadingDirection, true);
}

function changeRadarPosition(position, preloadOnly, force) {
    while (position >= radarFrames.length) {
        position -= radarFrames.length;
    }
    while (position < 0) {
        position += radarFrames.length;
    }

    var currentFrame = radarFrames[animationPosition];
    var nextFrame = radarFrames[position];

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
    radarLayers[nextFrame.path].setOpacity(60);


    var pastOrForecast = nextFrame.time > Date.now() / 1000 ? 'FORECAST' : 'PAST';

    document.getElementById("radar-time").innerHTML = pastOrForecast + ': ' + (new Date(nextFrame.time * 1000)).toString();
}

function addLayer(frame) {
    if (!radarLayers[frame.path]) {
        var colorScheme = radarKind == 'satellite' ? 0 : radarColorScheme;
        var smooth = radarKind == 'satellite' ? 0 : smoothRadarData;
        var snow = radarKind == 'satellite' ? 0 : radarSnowColors;

        var source = new L.TileLayer(radarData.host + frame.path + '/' + radarTileSize + '/{z}/{x}/{y}/' + colorScheme + '/' + smooth + '_' + snow + '.png', {
            tileSize: 256,
            opacity: 0.01,
            zIndex: frame.time
        });

        // Track layer loading state to not display the overlay 
        // before it will completelly loads
        source.on('loading', startLoadingTile);
        source.on('load', finishLoadingTile); 
        source.on('remove', finishLoadingTile);

        radarLayers[frame.path] = source;
    }
    if (!map2.hasLayer(radarLayers[frame.path])) {
        map2.addLayer(radarLayers[frame.path]);
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