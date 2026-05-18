<script>
    let {locationData, page = $bindable()} = $props();

    let shortForecast = $state(false);
    let info = $state(false);
    let image = $state("sunny");

    $effect(() => {
        if (locationData.hourly[0]) {
            shortForecast = locationData.hourly[0][0]["shortForecast"].toLowerCase();
            info = locationData.hourly[0][0]["temperature"] + " F - " + locationData.hourly[0][0]["shortForecast"];

            if (shortForecast.includes("rain") || shortForecast.includes("storm") || shortForecast.includes("drizzle")) {
                image = "rainy";
            } else if (shortForecast.includes("snow")) {
                image = "snowy";
            } else if (shortForecast.includes("wind")) {
                image = "windy";
            } else if (shortForecast.includes("cloud") || shortForecast.includes("fog")) {
                image = "cloudy";
            }
        }
    });
</script>

<div class="location {locationData.alert}">
    <div class="img-container">
        <img style="vertical-align:center;" src="img/{image}.svg">
    </div>
    <div class="location-view">
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

    .img-container {
        display: inline-block;
        margin-top: 25px;
        vertical-align: top;
    }

    .error {
        background-color: darkslategray !important;
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

    .location {
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
        height: auto;
    }

    h3 {
        margin-right: 8px;
    }
</style>