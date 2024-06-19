function getCurrentAQIForPositionAsync(lat, long, callback){
    window.loadingElements++;
    fetch("https://air-quality-api.open-meteo.com/v1/air-quality?latitude=" + lat + "&longitude=" + long + "&hourly=us_aqi")
        .then(data => data.json())
        .then(data => {
            let time = new Date();
            time = time.toISOString();
            time = time.split(":");
            time = time[0] + ":00";
            let index = data["hourly"]["time"].indexOf(time);
            window.loadingElements--;
            callback(data["hourly"]["us_aqi"][index]);
        })
}

function getCurrentAQIForNomAsync(nom, callback){
    window.loadingElements++;
    fetch("https://air-quality-api.open-meteo.com/v1/air-quality?latitude=" + nom["lat"] + "&longitude=" + nom["lon"] + "&hourly=us_aqi")
        .then(data => data.json())
        .then(data => {
            let time = new Date();
            time = time.toISOString();
            time = time.split(":");
            time = time[0] + ":00";
            let index = data["hourly"]["time"].indexOf(time);
            window.loadingElements--;
            callback(data["hourly"]["us_aqi"][index]);
        })
}

function getAdditionalWeatherDataForPositionAsync(lat, long, callback){
    window.loadingElements++;
    fetch("https://api.open-meteo.com/v1/forecast?latitude=" + lat
        + "&longitude=" + long
        /* Current parameters */ + "&current=apparent_temperature"
        /* Hourly parameters */ + "&hourly=apparent_temperature"
        /* Unit settings */ + "&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch")
        .then(data => data.json())
        .then(data => {
            window.loadingElements--;
            callback(data);
        })
}

function getAdditionalWeatherDataForNomAsync(nom, callback){
    window.loadingElements++;
    fetch("https://api.open-meteo.com/v1/forecast?latitude=" + nom["lat"]
        + "&longitude=" + nom["lon"]
        /* Current parameters */ + "&current=apparent_temperature"
        /* Hourly parameters */ + "&hourly=apparent_temperature"
        /* Unit settings */ + "&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch")
        .then(data => data.json())
        .then(data => {
            window.loadingElements--;
            callback(data);
        })
}

function removeOldData(times, data){
    let time = new Date();
    let UTCHour = time.getUTCHours();
    let newData;
    let a = 0;
    while (String(times[a]).endsWith(String(UTCHour) + ":00") === false){
        a++;
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
    return [newTimes, newData];
}

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
        return "Unhealthy for sensitive groups";
    }
    else if (AQI > 50){
        return "Moderate";
    }
    else{
        return "Good";
    }
}