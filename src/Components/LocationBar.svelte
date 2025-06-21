<script>
    let { locationData, page=$bindable() } = $props();

    let shortForecast = $state(false);
    let info = $state(false);
    let image = $state("sunny");
    let barClass = $state("noalerts");

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

            barClass = locationData.alert;

            if (locationData.name === "Current Location"){
                image = "current-location";

                if (locationData.alert === "noalerts"){
                    barClass = "currentloc";
                }
            }

            let warningCountText = (locationData.fullStatus[1] !== 1) ? " warnings" : " warning";
            let watchCountText = (locationData.fullStatus[2] !== 1) ? " watches" : " watch";

            if (locationData.alert === "warning"){
                image = "warning";
                if (locationData.name !== "Current Location"){
                    info = locationData.fullStatus[1].toString() + " " + warningCountText + " and " + locationData.fullStatus[2].toString() + " " + watchCountText;
                }
                else{
                    info = "A warning is in effect for your location.";
                }
            }
            if (locationData.alert === "watch"){
                if (locationData.name !== "Current Location"){
                    info = locationData.fullStatus[2].toString() + " " + watchCountText;
                }
                else{
                    info = "A watch is in effect for your location.";
                }
            }
            if (locationData.alert === "other"){
                info = "Weather statements in effect";
            }
        }
    });
</script>

{#if !locationData.hourly[0]}
    {#if locationData.name === "Current Location" && locationData.denied}
        <div class="location currentloc">
            <div class="imgContainer">
                <img alt="Location" src="img/current-location.svg">
            </div>
            <div class="locationView">
                <h2>{locationData.name}</h2>
                <h3>Please allow location permission or disable this in app settings.</h3>
            </div>
        </div>
        <br>
    {:else}
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
    {/if}
{:else}
    <div class="location {barClass}" onclick={()=>{page = "location-" + locationData.name}}>
        <div class="imgContainer">
            <img alt="Weather Status - {image}" src="img/{image}.svg">
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

    .currentloc {
        background-color: cadetblue !important;
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