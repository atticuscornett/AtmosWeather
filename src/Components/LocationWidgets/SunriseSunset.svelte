<script>
    let { locationData } = $props();

    let sunrise = $state("Loading...");
    let sunset = $state("Loading...");

    function getSunrise(){
        if (!locationData.openMeteoData){
            return;
        }

        if (!locationData.openMeteoData.daily){
            return;
        }

        if (!locationData.openMeteoData.daily["sunrise"]){
            return;
        }

        let sunriseRaw = locationData.openMeteoData.daily["sunrise"][0];
        let sunsetRaw = locationData.openMeteoData.daily["sunset"][0];

        let sunriseDate = new Date(sunriseRaw+"Z");
        let sunsetDate = new Date(sunsetRaw+"Z");

        let sunriseHours = sunriseDate.getHours();
        let sunsetHours = sunsetDate.getHours();

        if (sunriseHours === 0){
            sunriseHours = 12;
        }

        if (sunsetHours > 12){
            sunsetHours -= 12;
        }

        sunrise = sunriseHours + ":" + sunriseDate.getMinutes().toString().padStart(2, "0") + " AM";
        sunset = sunsetHours + ":" + sunsetDate.getMinutes().toString().padStart(2, "0") + " PM";
    }

    $effect(() => {
        getSunrise();
    })
</script>

<div class="centerContainer">
    <img src="img/sunny.svg" alt="Sunrise/Sunset" style="width: 50px; height: 50px;">
    <div class="text-holder">
        <h4>Sunrise: {sunrise}</h4>
        <h4>Sunset: {sunset}</h4>
        <h6>Times given in device time zone.</h6>
    </div>
</div>

<style>
    .text-holder {
        display: inline-block;
    }

    img {
        display: inline-block;
        margin-right: 10px;
    }

    h4 {
        width: fit-content;
    }

    .centerContainer {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #555;
        border-radius: 7px;
        margin-bottom: 15px;
        height: calc(100% - 15px);
        color: white;
    }
</style>