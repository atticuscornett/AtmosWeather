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