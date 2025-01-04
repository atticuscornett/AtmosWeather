/**
 * Fetches the current Air Quality Index (AQI) for a given latitude and longitude.
 *
 * @param {number} lat - The latitude of the location.
 * @param {number} long - The longitude of the location.
 * @param {function} callback - The callback function to handle the AQI data.
 */
function getCurrentAQIForPositionAsync(lat, long, callback){
    getCurrentAQIForNomAsync({"lat": lat, "lon": long}, callback);
}

/**
 * Fetches the current Air Quality Index (AQI) for a given nominatim object.
 *
 * @param {Object} nom - The nominatim object containing latitude and longitude.
 * @param {number} nom.lat - The latitude of the location.
 * @param {number} nom.lon - The longitude of the location.
 * @param {function} callback - The callback function to handle the AQI data.
 * @param {Array} [widgets=[]] - An optional array of widgets to that require the additional weather data.
 */
function getCurrentAQIForNomAsync(nom, callback, widgets=[]){
    addLoadingKey("currentAQI" + nom["lat"] + nom["lon"]);

    let hourlyParams = ["us_aqi"];

    for (let i of widgets){
        if (i.includes("AQIBreakdown")){
            hourlyParams.push("pm10");
            hourlyParams.push("pm2_5");
            hourlyParams.push("ozone");
            hourlyParams.push("carbon_monoxide");
            hourlyParams.push("nitrogen_dioxide");
            hourlyParams.push("sulphur_dioxide");
        }
    }

    fetch("https://air-quality-api.open-meteo.com/v1/air-quality?latitude=" + nom["lat"] + "&longitude=" + nom["lon"] +
        "&hourly=" + hourlyParams.join(","))
        .then(data => data.json())
        .then(data => {
            let time = new Date();
            time = time.toISOString();
            time = time.split(":");
            time = time[0] + ":00";
            let index = data["hourly"]["time"].indexOf(time);
            removeLoadingKey("currentAQI" + nom["lat"] + nom["lon"]);
            callback(data, index);
        })
}

/**
 * Fetches additional weather data for a given latitude and longitude.
 *
 * @param {number} lat - The latitude of the location.
 * @param {number} long - The longitude of the location.
 * @param {function} callback - The callback function to handle the weather data.
 * @param {Array} [widgets=[]] - An optional array of widgets to that require the additional weather data.
 */
function getAdditionalWeatherDataForPositionAsync(lat, long, callback, widgets=[]){
    getAdditionalWeatherDataForNomAsync({"lat": lat, "lon": long}, callback, widgets);
}

/**
 * Fetches additional weather data for a given nominatim object.
 *
 * @param {Object} nom - The nominatim object containing latitude and longitude.
 * @param {number} nom.lat - The latitude of the location.
 * @param {number} nom.lon - The longitude of the location.
 * @param {function} callback - The callback function to handle the weather data.
 * @param {Array} [widgets=[]] - An optional array of widgets to that require the additional weather data.
 */
function getAdditionalWeatherDataForNomAsync(nom, callback, widgets=[]){
    let currentParams = ["apparent_temperature"];
    let hourlyParams = ["apparent_temperature"];

    for (let i of widgets){
        if (i.includes("CAPEGraph")){
            hourlyParams.push("cape");
        }
    }

    let minutely_15 = [];
    for (let i of widgets){
        if (i.includes("Next15Minutes")){
            minutely_15.push("temperature_2m")
            minutely_15.push("apparent_temperature");
            minutely_15.push("precipitation");
            minutely_15.push("wind_speed_10m");
            minutely_15.push("wind_gusts_10m");
            minutely_15.push("visibility");
        }
    }

    let daily = [];
    for (let i of widgets){
        if (i.includes("SunriseSunset")){
            daily.push("sunrise");
            daily.push("sunset");
        }
    }


    let minutely_15_string = "&minutely_15=" + minutely_15.join(",");
    if (minutely_15 === []){
        minutely_15_string = "";
    }

    let daily_string = "&daily=" + daily.join(",");
    if (daily === []){
        daily_string = "";
    }

    addLoadingKey("additionalWeather" + nom["lat"] + nom["lon"]);
    fetch("https://api.open-meteo.com/v1/forecast?latitude=" + nom["lat"]
        + "&longitude=" + nom["lon"]
        /* Current parameters */ + "&current=" + currentParams.join(",")
        /* Hourly parameters */ + "&hourly=" + hourlyParams.join(",")
        /* 15-Minutely parameters */ + minutely_15_string
        /* Daily parameters */ + daily_string
        /* Unit settings */ + "&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch")
        .then(data => data.json())
        .then(data => {
            removeLoadingKey("additionalWeather" + nom["lat"] + nom["lon"]);
            callback(data);
        })
}

/**
 * Removes old data points from the provided times and data arrays, keeping only the most recent data.
 *
 * @param {Array} times - An array of time strings in ISO format.
 * @param {Array} data - An array of data points corresponding to the times.
 * @returns {Array} - A tuple containing the filtered times and data arrays.
 */
function removeOldData(times, data){
    let time = new Date();
    let UTCHour = time.getUTCHours();
    let newData;
    let a = 0;
    while (String(times[a]).endsWith(String(UTCHour) + ":00") === false){
        a++;
        if (a > 50){
            break;
        }
    }
    newData = data.slice(a);
    let newTimes = times.slice(a);
    newTimes = newTimes.map((time) => {
        let timeString = new Date(time+"Z");
        timeString = timeString.getHours();
        let AMPM = "AM";
        if (timeString > 12){
            timeString -= 12;
            AMPM = "PM";
        }
        if (timeString == 0){
            timeString = 12;
        }
        return timeString + " " + AMPM;
    })

    newData = newData.map((data) => Math.round(data));
    
    return [newTimes, newData];
}

function removeOldData15Minutely(times, data){
    let time = new Date();
    let UTCHour = time.getUTCHours();
    let UTCMinute = time.getUTCMinutes();

    if (UTCMinute < 15){
        UTCMinute = 0;
    }
    else if (UTCMinute < 30){
        UTCMinute = 15;
    }
    else if (UTCMinute < 45){
        UTCMinute = 30;
    }
    else{
        UTCMinute = 45;
    }

    let UTCMinuteString = String(UTCMinute);
    if (UTCMinuteString.length === 1){
        UTCMinuteString = "0" + UTCMinuteString;
    }

    while (String(times[0]).endsWith(String(UTCHour) + ":" + UTCMinuteString) === false){
        times.shift();
        data.shift();
    }
    
    let newTimes = times.slice(0, 4);
    let newData = data.slice(0, 4);

    newTimes = newTimes.map((time) => {
        let timeString = new Date(time+"Z");
        timeString = timeString.getHours();
        let AMPM = "AM";
        if (timeString > 12){
            timeString -= 12;
            AMPM = "PM";
        }
        if (timeString == 0){
            timeString = 12;
        }
        return timeString + " " + AMPM;
    })

    newData = newData.map((data) => Math.round(data));

    return [newTimes, newData];
}

function ftToDistanceString(feet){
    if (feet < 3000){
        return Math.round(feet) + " ft";
    }
    else{
        return (Math.round((feet/5280) * 10) / 10) + " mi";
    }
}