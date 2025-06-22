<script>
    let { locationData } = $props();
    let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let dateAhead = new Date();
    dateAhead.setTime(dateAhead.getTime() + (48 * 60 * 60 * 1000));
    let dateAheadDay = dateAhead.getDay();
    let dateAheadDayName = daysOfWeek[dateAheadDay];

    let aqiData = $state(["Loading...", "Loading...", "Loading..."]);

    let getHighestAQIs = () => {
        if (!locationData.hourly){
            setTimeout(getHighestAQIs, 1000);
        }

        let indexScan = locationData.AirQualityAPIIndex;
        let highest24 = locationData.AirQualityAPI["hourly"]["us_aqi"][locationData.AirQualityAPIIndex];
        for (let i = 0; i < 24; i++){
            if (locationData.AirQualityAPI["hourly"]["us_aqi"][indexScan] > highest24){
                highest24 = locationData.AirQualityAPI["hourly"]["us_aqi"][indexScan];
            }
            indexScan++;
        }

        let highest48 = locationData.AirQualityAPI["hourly"]["us_aqi"][indexScan];
        for (let i = 0; i < 24; i++){
            if (locationData.AirQualityAPI["hourly"]["us_aqi"][indexScan] > highest48){
                highest48 = locationData.AirQualityAPI["hourly"]["us_aqi"][indexScan];
            }
            indexScan++;
        }

        let highest72 = locationData.AirQualityAPI["hourly"]["us_aqi"][indexScan];
        for (let i = 0; i < 24; i++){
            if (locationData.AirQualityAPI["hourly"]["us_aqi"][indexScan] > highest72){
                highest72 = locationData.AirQualityAPI["hourly"]["us_aqi"][indexScan];
            }
            indexScan++;
        }

        aqiData = [highest24, highest48, highest72];
    }

    getHighestAQIs();
</script>

<div class="centerContainer">
    <h1>Highest AQI Next 3 Days</h1>

    <h2>Today: {aqiData[0]}</h2>
    <h2>Tomorrow: {aqiData[1]}</h2>
    <h2>{dateAheadDayName}: {aqiData[2]}</h2>
</div>

<style>
    .centerContainer {
        background: #555;
        border-radius: 7px;
        margin-bottom: 15px;
        height: calc(100% - 30px);
        color: white;
        text-align: center;
        padding-top: 15px;
        padding-bottom: 15px;
    }

    h1 {
        padding-top: 1px;
    }
</style>