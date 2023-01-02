function getCurrentAQIForPositionAsync(lat, long, callback){
    fetch("https://air-quality-api.open-meteo.com/v1/air-quality?latitude=" + lat + "&longitude=" + long + "&hourly=us_aqi")
        .then(data => data.json())
        .then(data => {
            let time = new Date();
            time = time.toISOString();
            time = time.split(":");
            time = time[0] + ":00";
            let index = data["hourly"]["time"].indexOf(time);
            callback(data["hourly"]["us_aqi"][index]);
        })
}

function getCurrentAQIForNomAsync(nom, callback){
    fetch("https://air-quality-api.open-meteo.com/v1/air-quality?latitude=" + nom["lat"] + "&longitude=" + nom["lon"] + "&hourly=us_aqi")
        .then(data => data.json())
        .then(data => {
            let time = new Date();
            time = time.toISOString();
            time = time.split(":");
            time = time[0] + ":00";
            let index = data["hourly"]["time"].indexOf(time);
            callback(data["hourly"]["us_aqi"][index]);
        })
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