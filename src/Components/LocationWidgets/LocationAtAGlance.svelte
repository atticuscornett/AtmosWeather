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
        }
    });
</script>

<div class="location {locationData.alert}">
    <div class="imgContainer">
        <img style="vertical-align:center;" src="img/{image}.svg">
    </div>
    <div class="locationView">
        <h1>{locationData.hourly[0][0]["temperature"]}° F</h1>
        {#if locationData.openMeteoData}
            <h4>Feels like {Math.round(locationData.openMeteoData["current"]["apparent_temperature"])}° F</h4>
        {/if}
        {#if locationData.hourly[0][0]["shortForecast"]}
            <h3>{locationData.hourly[0][0]["shortForecast"]}</h3>
            {:else}
            <h3>
                There is no currently available short forecast for this location.
                This may be due to extreme hazardous conditions or NWS API errors.
            </h3>
        {/if}
    </div>
</div>
<br>

<style>

   .imgContainer{
       display: inline-block;
       height: inherit;
       vertical-align: top;
       margin-top: 20px;
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