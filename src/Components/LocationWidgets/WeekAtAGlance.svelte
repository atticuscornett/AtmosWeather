<script>
    let { locationData } = $props();

    let dayDictionary = {};
    let dayOrder = [];
    let dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let dayOfWeekOrder = [];
    let dailyForecast = $state([]);
    let imagePriority = ["stormy", "snowy", "rainy", "windy", "cloudy", "sunny"];

    let sortByDay = () => {
        dayDictionary = {};
        dayOrder = [];
        let forecast = locationData.forecast[0];
        for (let i = 0; i < forecast.length; i++){
            let day = forecast[i]["startTime"].slice(0, 10);
            if (!dayDictionary[day]){
                dayDictionary[day] = [];
            }
            if (!dayOrder.includes(day)){
                dayOrder.push(day);
                dayOfWeekOrder.push(dayOfWeek[new Date(day + "T00:00:00").getDay()]);
            }
            dayDictionary[day].push(forecast[i]);
        }
    }

    let imageDecide = (forecastText) => {
        let image;

        let colorScheme = window.appTheme;


        if (forecastText.includes("tornado") || forecastText.includes("storm") || forecastText.includes("water spout")){
            image = "stormy";
        }
        else if (forecastText.includes("snow")){
            image = "snowy";
        }
        else if (forecastText.includes("rain") || forecastText.includes("drizzle")){
            image = "rainy";
        }
        else if (forecastText.includes("windy") || forecastText.includes("strong wind") || forecastText.includes("gusty")){
            image = "windy";
        }
        else if (forecastText.includes("cloud") || forecastText.includes("fog")){
            image = "cloudy";
        }
        else{
            image = "sunny";
        }


        return image;
    }

    let compileDailyForecast = () => {
        if (!locationData.forecast){
            return [];
        }

        sortByDay();
        let tempDailyForecast = [];
        for (let i = 0; i < dayOrder.length; i++){
            let forecastDictionary = {};
            forecastDictionary["day"] = dayOrder[i].slice(5).replace("-", "/");
            forecastDictionary["weekday"] = dayOfWeekOrder[i];

            forecastDictionary["precipChance"] = 0;
            forecastDictionary["highTemp"] = -1000;
            forecastDictionary["lowTemp"] = 1000;

            let lowestPriority = 6;


            for (let j = 0; j < dayDictionary[dayOrder[i]].length; j++){
                // Set precipitation chance to the highest value for day
                if (dayDictionary[dayOrder[i]][j]["probabilityOfPrecipitation"]["value"] > forecastDictionary["precipChance"]){
                    forecastDictionary["precipChance"] = dayDictionary[dayOrder[i]][j]["probabilityOfPrecipitation"]["value"];
                }

                // Set high and low temperatures for the day
                if (dayDictionary[dayOrder[i]][j]["temperature"] > forecastDictionary["highTemp"]){
                    forecastDictionary["highTemp"] = dayDictionary[dayOrder[i]][j]["temperature"];
                }
                if (dayDictionary[dayOrder[i]][j]["temperature"]< forecastDictionary["lowTemp"]){
                    forecastDictionary["lowTemp"] = dayDictionary[dayOrder[i]][j]["temperature"];
                }

                if (imagePriority.indexOf(imageDecide(dayDictionary[dayOrder[i]][j]["detailedForecast"].toLowerCase())) < lowestPriority){
                    forecastDictionary["image"] = imageDecide(dayDictionary[dayOrder[i]][j]["detailedForecast"]);
                    lowestPriority = imagePriority.indexOf(forecastDictionary["image"]);
                }
            }

            let colorScheme = window.appTheme;
            forecastDictionary["imageSrc"] = colorScheme === "dark" ? "img/"+forecastDictionary["image"]+".svg"
                : "img/"+forecastDictionary["image"]+"-adaptive.svg";

            tempDailyForecast.push(forecastDictionary);
        }
        return tempDailyForecast;
    }



    dailyForecast = compileDailyForecast();
</script>

<h2>Week At A Glance</h2>

<div class="look-container">
    {#if dailyForecast}
        {#each dailyForecast as forecast}
            <div class="daily-look">
                <img src={forecast["imageSrc"]} alt={forecast["image"]} style="width: 50px; height: 50px;">
                {#if forecast?.lowTemp === undefined}
                    <h3>{forecast?.highTemp ?? '--'}°F</h3>
                {:else}
                    <h3>{forecast?.highTemp ?? '--'}°/ {forecast?.lowTemp ?? '--'}°F</h3>
                {/if}
                <h4>{forecast?.precipChance ?? 0}%</h4>
                <h5>{forecast?.day ?? ''}</h5>
                <h5>{forecast?.weekday ?? ''}</h5>
            </div>
        {/each}
    {/if}
</div>

<style>
    .look-container {
        display: flex;
        justify-content: space-around;
        overflow-x: auto;
        margin-bottom: 15px;
        margin-top: 70px;
    }

    .daily-look {
        display: inline-block;
        margin-right: 20px;
        border: black 5px solid;
        border-radius: 7px;
        flex: 0 0 0;
        text-align: center;
        padding: 15px;
    }

    :global(body.dark) .daily-look {
        border: white 5px solid;
    }

    h3, h4, h5 {
        margin-bottom: 0;
    }

    h2 {
        position: absolute;
    }
</style>