<script>
    let { locationData, page=$bindable() } = $props();

    let shortForecast = $state(false);
    let info = $state(false);
    let image = $state("sunny");
    let barClass = $state("noalerts");

    $effect(() => {
        if (locationData && locationData.hourly && locationData.hourly[0]){
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
                    barClass = "current-loc";
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

{#if locationData && (!locationData.hourly || !locationData.hourly[0])}
    {#if locationData.name === "Current Location" && locationData.denied}
        <div class="location current-loc">
            <div class="img-container">
                <img alt="Location" src="img/current-location.svg">
            </div>
            <div class="location-view">
                <h2>{locationData.name}</h2>
                <h3>Please allow location permission or disable this in app settings.</h3>
            </div>
        </div>
        <br>
    {:else}
        <div class="location error">
            <div class="img-container">
                <img class="error-img" alt="Location Error" src="img/error.svg">
            </div>
            <div class="location-view">
                <h2>{locationData.name}</h2>
                <h3>Loading location data...</h3>
            </div>
        </div>
        <br>
    {/if}
{:else}
    {#if locationData && locationData.name}
        <div class="location {barClass}" onclick={()=>{page = "location-" + locationData.name}}>
            <div class="img-container">
                <img alt="Weather Status - {image}" src="img/{image}.svg">
            </div>
            <div class="location-view">
                <h2>{locationData.name}</h2>
                <h3>{info}&emsp;(Tap for more info.)</h3>
            </div>
        </div>
        <br>
    {/if}
{/if}


<style>
    @keyframes load-anim {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    .img-container {
        display: inline-block;
        height: inherit;
        vertical-align: top;
        margin-top: 35px;
    }

    .error {
        background-color: var(--error-background) !important;
    }

    .current-loc {
        background-color: var(--current-location-background) !important;
    }


    .error-img {
        vertical-align: center;
        animation: load-anim infinite 2s;
    }

    .status-img {
        vertical-align: center;
    }

    .location-view {
       display: inline-block;
       margin-left: 8px;
       margin-right: 8px;
    }

    .location{
        background-color: var(--default-background);
        color: var(--location-text-color);
        border-radius: 7px;
        padding-top: 1px;
        padding-bottom: 1px;
        padding-left: 20px;
        -webkit-box-sizing: border-box;
        -mox-box-sizing: border-box;
        box-sizing: border-box;
        cursor: pointer;
        box-shadow: 0 0 7px var(--box-shadow-color);
    }

    h3 {
        margin-right: 8px;
    }
</style>