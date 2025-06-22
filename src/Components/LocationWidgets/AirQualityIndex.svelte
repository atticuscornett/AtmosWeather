<script>
    let { locationData } = $props();
    let randomId = Math.round(Math.random()*1000000);

    let AQICategory = $state(null);
    $effect(() => {
        if (locationData.AQI){
            let max = 300;
            let min = 0;
            let leftAmount = (locationData.AQI - min)/(max-min);
            leftAmount = leftAmount * 100;
            if (leftAmount > 50){
                leftAmount = "calc(" + leftAmount + "% - 22px)";
            }
            else{
                leftAmount = "calc(" + leftAmount + "% + 3.5px)";
            }
            document.getElementById("location-"+locationData.name+"-AQI" + randomId).style.left = leftAmount;
            AQICategory = getAQICategory(locationData.AQI);
        }
    })

    function getAQICategory(AQI){
        if (AQI > 300){
            return "Hazardous";
        }
        else if (AQI > 200){
            return "Very Unhealthy";
        }
        else if (AQI > 150){
            return "Unhealthy";
        }
        else if (AQI > 100){
            return "Unhealthy for Sensitive Groups";
        }
        else if (AQI > 50){
            return "Moderate";
        }
        else{
            return "Good";
        }
    }
</script>

{#if locationData.AQI}
    <div class="clear-border">
        <h1>Air Quality Index (AQI)</h1>
        <h2>{locationData.AQI} ({AQICategory})</h2>
        <div class="gauge-container">
            <div class="gauge-background"></div>
            <div class="gauge-marker" id={"location-"+locationData.name+"-AQI" + randomId}></div>
        </div>
        <h5>Air Quality Data from <a href="https://open-meteo.com/" target="_blank">Open-Meteo</a></h5>
    </div>
    <br>
{/if}

<style>
    .gauge-container{
        height: 22px;
        position: relative;
    }

    .gauge-background {
        position: absolute;
        background: linear-gradient(90deg, rgb(16, 167, 74) 0%, rgb(244, 248, 9) 20%, rgb(255, 145, 0) 40%, rgb(253, 1, 1) 60%, rgb(146, 13, 158) 80%, rgb(97, 12, 19) 100%);
        height: 22px;
        width: 100%;
        border-radius: 5px;
    }

    .gauge-marker{
        background-color: white;
        position: relative;
        border-radius: 50%;
        width: 15px;
        height: 15px;
        top: 3.5px;
        left: 3.5px;
    }

    .clear-border{
        border: black solid;
        border-radius: 7px;
        box-shadow: 0 0 7px #898989;
        padding: 0 20px 0 20px;
        height: calc(100% - 30px);
        margin-top: 10px;
    }

    :global(body.dark) .clear-border{
        border: white solid;
        border-radius: 7px;
        box-shadow: 0 0 7px #898989;
        padding: 0 20px 0 20px;
        margin-top: 10px;
    }
</style>