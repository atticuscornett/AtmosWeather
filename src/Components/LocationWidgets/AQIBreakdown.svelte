<script>
    let { locationData } = $props();

    let isDataReady = $state(false);

    let checkDataReady = () => {
        isDataReady = locationData.AirQualityAPI &&
            locationData.AirQualityAPI["hourly"] &&
            locationData.AirQualityAPI["hourly"]["pm2_5"];
        console.log(locationData);
        console.log(isDataReady);
    }

    $effect(() => {
        checkDataReady();
    });
</script>

<div class="centerContainer">
    <img src="img/windy.svg" alt="Air Quality" style="width: 50px; height: 50px;">
    <h2>AQI Breakdown</h2>
    <h3>AQI: {locationData.AQI}</h3>
    <!-- Check if the data is ready -->
    {#if
        locationData.AirQualityAPI &&
        locationData.AirQualityAPI["hourly"] &&
        locationData.AirQualityAPI["hourly"]["pm2_5"]
    }
        <div>
            <div class="text-holder spaced-holder">
                    <h4>Ozone: {locationData.AirQualityAPI["hourly"]["ozone"][locationData.AirQualityAPIIndex]} μg/m3</h4>
                    <h4>PM 2.5: {locationData.AirQualityAPI["hourly"]["pm2_5"][locationData.AirQualityAPIIndex]} μg/m3</h4>
                    <h4>PM 10: {locationData.AirQualityAPI["hourly"]["pm10"][locationData.AirQualityAPIIndex]} μg/m3</h4>
            </div>
            <div class="text-holder">
                    <h4>CO: {locationData.AirQualityAPI["hourly"]["carbon_monoxide"][locationData.AirQualityAPIIndex]} μg/m3</h4>
                    <h4>SO₂: {locationData.AirQualityAPI["hourly"]["sulphur_dioxide"][locationData.AirQualityAPIIndex]} μg/m3</h4>
                    <h4>NO₂: {locationData.AirQualityAPI["hourly"]["nitrogen_dioxide"][locationData.AirQualityAPIIndex]} μg/m3</h4>
            </div>
        </div>
    {:else}
        <h3>Loading...</h3>
    {/if}

</div>

<style>
    .text-holder {
        display: inline-block;
    }

    .spaced-holder {
        margin-right: 40px;
    }

    h4 {
        width: fit-content;
        margin-bottom: 0;
    }

    h3 {
        margin-bottom: 0;
    }

    h2 {
        margin-bottom: 0;
    }

    .centerContainer {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #555;
        border-radius: 7px;
        margin-bottom: 15px;
        height: calc(100% - 30px);
        color: white;
        flex-direction: column;
        padding-bottom: 15px;
    }

    img {
        margin-top: 10px;
    }
</style>