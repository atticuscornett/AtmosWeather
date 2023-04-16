// Fade out logo and handle notices after animation is done
setTimeout(function(){
    showNotices();
}, 4000);

// Adds function to the navigation buttons (from atmos-ui.js)
activateNavButtons();
// Check status of NWS API periodically (from atmos-ui.js)
setInterval(async () => {
      const result = await checkAPIstatus();
      if (!result){
        document.getElementById("offlineError").hidden = false;
    }
    else{
        document.getElementById("offlineError").hidden = true;
    }
}, 60000);
setTimeout(async () => {
      const result = await checkAPIstatus();
      if (!result){
        document.getElementById("offlineError").hidden = false;
    }
    else{
        document.getElementById("offlineError").hidden = true;
    }
}, 100);

// Allow Enter key on search
document.getElementById("location-search").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        document.getElementById("search-button").click();
      }
});

// Refresh radar when weather outlook changes
document.getElementById("spc-select").onchange = () => {
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

// Save settings when a setting is changed
document.getElementById("tab-settings").onchange = saveSettings;
document.getElementById("tab-single-location-settings").onchange = saveLocationSettings;

// Refresh location data
setTimeout(refreshLocations, 200);