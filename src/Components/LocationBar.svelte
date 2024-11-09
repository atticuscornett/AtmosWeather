<script>
    let { locationData, page=$bindable() } = $props();

    let shortForecast = $state(false);
    let info = $state(false);
    let image = $state("sunny");

    $effect(() => {
        if (locationData.hourly[0]){
            shortForecast = locationData.hourly[0][0]["shortForecast"].toLowerCase();
            info = locationData.hourly[0][0]["temperature"] + " F - " + locationData.hourly[0][0]["shortForecast"]

            if (shortForecast.includes("rain") || shortForecast.includes("storm") || shortForecast.includes("drizzle")){
                image = "rainy";
            }
            else if (shortForecast.includes("snow")){
                image = "snowy";
            }
            else if (shortForecast.includes("wind")){
                image = "windy";
            }
            else if (shortForecast.includes("cloud") || shortForecast.includes("fog")){
                image = "cloudy";
            }

            if (locationData.alert === "warning"){
                image = "warning";
                info = locationData.fullStatus[1].toString() + " warning(s) and " + locationData.fullStatus[2].toString() + " watch(es)";
            }
            if (locationData.alert === "watch"){
                info = locationData.fullStatus[2].toString() + " watch(es)";
            }
            if (locationData.alert === "other"){
                info = "Weather statements in effect";
            }
        }
    });

    // if (nomLocations.length > 0){
    //     if (locationEnabled){
    //         document.getElementById("location-main").innerHTML = '<div class="location ' + "currentloc" + '" id="currentLocDiv"><div style="display: inline-block;height: inherit;vertical-align: top;margin-top:35px;"><img style="vertical-align:center;" src="img/' + "current-location" + '.svg"></div><div style="display:inline-block;margin-left:8px;margin-right:8px;"><h2 id="currentLocTitle">' + "Current Location" + '</h2><h3 id="currentLocData">Loading information...</h3></div></div><br>';
    //     }
    //     else{
    //         document.getElementById("location-main").innerHTML = "";
    //     }
    //     var a = 0;
    //     while (a < nomLocations.length){
    //         nomToWeatherGridAsync(nomLocations[a], (nomRes, a) => {
    //             getHourlyForecastAsync(nomRes, (hourly) => {
    //                 getStatusAsync(nomLocations[a], (fullStatus) => {
    //                     var alertStatus = fullStatus[0];
    //                     var image = "sunny";
    //                     if (!hourly[0]){
    //                         if (!refreshAgain){
    //                             refreshAgain = true;
    //                             setTimeout(refreshLocations, 7000);
    //                         }
    //                         document.getElementById("location-main").innerHTML += theDiv;
    //                     }
    //                     else{
    //
    //                         var theDiv = '<div class="location ' + alertStatus + '" onclick="navTo(\'locdat-' + nomLocationNames[a] + '-' + a.toString() + '\')"><div style="display: inline-block;height: inherit;vertical-align: top;margin-top:35px;"><img style="vertical-align:center;" src="img/' + image + '.svg"></div><div style="display:inline-block;margin-left:8px;margin-right:8px;"><h2>' + nomLocationNames[a] + '</h2><h3 style="margin-right:8px;">' + info + '&emsp;(Tap for more info.)</h3></div></div><br>';
    //                         if (alertStatus == "warning"){
    //                             document.getElementById("location-w-alert").innerHTML += theDiv;
    //                         }
    //                         else if (alertStatus == "watch" || alertStatus == "other"){
    //                             document.getElementById("location-w-other").innerHTML += theDiv;
    //                         }
    //                         else{
    //                             document.getElementById("location-main").innerHTML += theDiv;
    //                         }
    //                         document.getElementById("location-data").innerHTML += "<div id='tab-locdat-" + nomLocationNames[a] + '-' + a.toString() + "' class='tab-div' hidden><h1>" + nomLocationNames[a] + "</h1></div>";
    //                     }
    //                 });
    //             });
    //         }, a);
    //         a++;
    //     }
    // }
</script>

{#if !locationData.hourly[0]}
    <div class="location error">
        <div class="imgContainer">
            <img class="errorImg" alt="Location Error" src="img/error.svg">
        </div>
        <div class="locationView">
            <h2>{locationData.name}</h2>
            <h3>Loading location data...</h3>
        </div>
    </div>
    <br>
{:else}
    <div class="location {locationData.alert}" onclick={page = "location-" + locationData.name}>
        <div class="imgContainer">
            <img style="vertical-align:center;" src="img/{image}.svg">
        </div>
        <div class="locationView">
            <h2>{locationData.name}</h2>
            <h3>{info}&emsp;(Tap for more info.)</h3>
        </div>
    </div>
    <br>
{/if}


<style>
    @keyframes loadAnim{
        0%{
            transform: rotate(0deg);
        }
        100%{
            transform: rotate(360deg);
        }
    }

   .imgContainer{
       display: inline-block;
       height: inherit;
       vertical-align: top;
       margin-top:35px;
   }

   .error{
       background-color: darkslategray !important;
   }

   .errorImg {
       vertical-align: center;
       animation: loadAnim infinite 2s;
   }

   .statusImg {
       vertical-align: center;
   }

   .locationView {
       display:inline-block;
       margin-left:8px;
       margin-right:8px;
   }

    .location{
        background-color: blue;
        color: white;
        border-radius: 7px;
        padding-top: 1px;
        padding-bottom: 1px;
        padding-left: 20px;
        -webkit-box-sizing: border-box;
        -mox-box-sizing: border-box;
        box-sizing: border-box;
        cursor: pointer;
        box-shadow: 0 0 7px #898989;
    }

    h3 {
        margin-right: 8px;
    }
</style>