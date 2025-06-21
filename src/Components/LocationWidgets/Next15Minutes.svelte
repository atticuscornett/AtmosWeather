<script>
    let { locationData } = $props();

    let dataAvailable = $state(false);

    let minutelyData = {}

    $effect(() => {
        if (!locationData.openMeteoData){
            return;
        }

        if (!locationData.openMeteoData["minutely_15"]){
            return;
        }

        if (!locationData.openMeteoData["minutely_15"]["time"]){
            return;
        }

        if (!locationData.openMeteoData["minutely_15"]["temperature_2m"]){
            return;
        }

        if (!locationData.openMeteoData["minutely_15"]["precipitation"]){
            return;
        }

        if (!locationData.openMeteoData["minutely_15"]["wind_speed_10m"]){
            return;
        }

        if (!locationData.openMeteoData["minutely_15"]["wind_gusts_10m"]){
            return;
        }

        let minutelyRaw = locationData.openMeteoData["minutely_15"];

        minutelyData["temp"] = removeOldData15Minutely(minutelyRaw["time"], minutelyRaw["temperature_2m"])[1][0];
        minutelyData["precip"] = removeOldData15Minutely(minutelyRaw["time"], minutelyRaw["precipitation"])[1][0];
        minutelyData["wind_speed"] = removeOldData15Minutely(minutelyRaw["time"], minutelyRaw["wind_speed_10m"])[1][0];
        minutelyData["wind_gusts"] = removeOldData15Minutely(minutelyRaw["time"], minutelyRaw["wind_gusts_10m"])[1][0];
        minutelyData["apparent_temp"] = removeOldData15Minutely(minutelyRaw["time"], minutelyRaw["apparent_temperature"])[1][0];
        minutelyData["visibility"] = ftToDistanceString(removeOldData15Minutely(minutelyRaw["time"], minutelyRaw["visibility"])[1][0]);

        dataAvailable = true;
    });
</script>

{#if locationData.openMeteoData && dataAvailable}
    <div class="clear-border">
        <h2>Next 15 Minutes</h2>
        <div class="widgetOutline">
            <div class="column">
                <h3>Temperature: {minutelyData["temp"]}° F</h3>
                <h3>Feels Like: {minutelyData["apparent_temp"]}° F</h3>
                <h3>Precipitation: {minutelyData["precip"]} in</h3>
            </div>
            <div class="column">
                <h3>Wind Speed: {minutelyData["wind_speed"]} mph</h3>
                <h3>Wind Gusts: {minutelyData["wind_gusts"]} mph</h3>
                <h3>Visibility: {minutelyData["visibility"]}</h3>
            </div>
        </div>
    </div>
{:else}
    <h4>Waiting for additional weather data...</h4>
{/if}

<style>
    .column {
        display: flex;
        flex-direction: column;
    }

    .widgetOutline {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;

    }

    h2 {
        text-align: center;
        margin-top: 0;
    }

    .clear-border{
        border: black solid;
        border-radius: 7px;
        box-shadow: 0 0 7px #898989;
        padding: 0 20px 0 20px;
    }

    :global(body.dark) .clear-border{
        border: white solid;
        border-radius: 7px;
        box-shadow: 0 0 7px #898989;
        padding: 0 20px 0 20px;
    }
</style>
