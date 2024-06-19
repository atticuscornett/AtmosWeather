let drawnCharts = {};

function clearCharts(location){
    let stringLoc = String(location);
    if (drawnCharts[stringLoc]){
        for (let chart of drawnCharts[stringLoc]){
            chart.destroy();
        }
    }
}

function makeTempGraph(location, data){
    if (drawnCharts[String(location)] === undefined){
        drawnCharts[String(location)] = [];
    }

    let forecastTime;
    let AMPM;
    let timePeriods = [];
    let tempPeriods = [];
    let imagePeriods = [];
    let tempColorPeriods = [];
    const tempColorGradient = chroma.scale(['purple', 'dodgerblue', 'lime', 'yellow', 'red']);
    let lastImage = "";
    let lastImageChange = -10;
    let image;

    for (let a = 0; a < 24; a++){
        // Decide on weather icon
        sfor = data[a]["shortForecast"].toLowerCase();
        if (sfor.includes("rain") || sfor.includes("drizzle")){
            image = "rainy";
        }
        else if (sfor.includes("tornado") || sfor.includes("storm") || sfor.includes("water spout")){
            image = "stormy";
        }
        else if (sfor.includes("snow")){
            image = "snowy";
        }
        else if (sfor.includes("wind")){
            image = "windy";
        }
        else if (sfor.includes("cloud") || sfor.includes("fog")){
            image = "cloudy";
        }
        else{
            image = "sunny";
        }

        // Convert time to 12-hour format
        forecastTime = data[a]["startTime"];
        forecastTime = parseInt(forecastTime.substr(11,2));
        AMPM = "AM";
        if (forecastTime > 11){
            AMPM = "PM";
        }
        if (forecastTime > 12){
            forecastTime -= 12;
        }
        if (forecastTime == 0){
            forecastTime = 12;
        }

        if (a > 0 && image !== lastImage && lastImageChange + 2 < a){
            let colorScheme = window.appTheme;
            let imageObj = new Image();
            imageObj.src = colorScheme === "dark" ? "img/"+image+".svg" : "img/"+image+"-adaptive.svg";
            imagePeriods.push(imageObj);
            lastImage = image;
            lastImageChange = a;
        }
        else{
            imagePeriods.push(null);
        }
        timePeriods.push(forecastTime.toString() + " " + AMPM);
        // Generate graph colors and data
        tempColorPeriods.push(tempColorGradient(data[a]["temperature"]/100).hex());
        tempPeriods.push(data[a]["temperature"]);
    }

    Chart.defaults.font.size = 18;
    Chart.defaults.font.family = "Secular One";

    let chart = new Chart(document.getElementById(String(location) + "-loc-hourly-temp-chart"), {
        type: 'line',
        data: {
            labels: timePeriods,
            datasets: [{
                label: 'Forecast Temperature',
                data: tempPeriods,
                pointStyle: imagePeriods,
                pointHoverRadius: 20,
                pointHitRadius: 20,
                pointRadius: 7,
                backgroundColor: tempColorPeriods,
                fill: false,
                borderWidth: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (item) =>
                            `${item.dataset.label}: ${item.formattedValue} °F`,
                    },
                }
            },
            tension: 0.4
        }
    });
    drawnCharts[String(location)].push(chart);
    return chart;
}

function makeDewpointGraph(location, data){
    if (drawnCharts[String(location)] === undefined){
        drawnCharts[String(location)] = [];
    }

    let forecastTime;
    let AMPM;
    let timePeriods = [];
    let tempPeriods = [];
    let tempColorPeriods = [];
    const tempColorGradient = chroma.scale(['purple', 'dodgerblue', 'lime', 'yellow', 'red']);

    for (let a = 0; a < 24; a++){

        // Convert time to 12-hour format
        forecastTime = data[a]["startTime"];
        forecastTime = parseInt(forecastTime.substr(11,2));
        AMPM = "AM";
        if (forecastTime > 11){
            AMPM = "PM";
        }
        if (forecastTime > 12){
            forecastTime -= 12;
        }
        if (forecastTime == 0){
            forecastTime = 12;
        }

        timePeriods.push(forecastTime.toString() + " " + AMPM);
        // Generate graph colors and data
        tempColorPeriods.push(tempColorGradient(convertTempUnit(data[a]["dewpoint"]["value"], "C")/100).hex());
        tempPeriods.push(convertTempUnit(data[a]["dewpoint"]["value"], "C"));
    }

    Chart.defaults.font.size = 18;
    Chart.defaults.font.family = "Secular One";

    let chart = new Chart(document.getElementById(String(location) + "-loc-hourly-dewpoint-chart"), {
        type: 'line',
        data: {
            labels: timePeriods,
            datasets: [{
                label: 'Dew Point',
                data: tempPeriods,
                pointHoverRadius: 20,
                pointHitRadius: 20,
                pointRadius: 7,
                backgroundColor: tempColorPeriods,
                fill: false,
                borderWidth: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (item) =>
                            `${item.dataset.label}: ${item.formattedValue} °F`,
                    },
                }
            },
            tension: 0.4
        }
    });
    drawnCharts[String(location)].push(chart);
    return chart;
}

function makeFeelsLikeGraph(location, data){
    if (drawnCharts[String(location)] === undefined){
        drawnCharts[String(location)] = [];
    }

    console.log(data)

    let timePeriods = data[0].slice(0, 24);
    let tempPeriods = [];
    let tempColorPeriods = [];
    const tempColorGradient = chroma.scale(['purple', 'dodgerblue', 'lime', 'yellow', 'red']);

    for (let a = 0; a < 24; a++){
        // Generate graph colors and data
        tempColorPeriods.push(tempColorGradient(data[1][a]/100).hex());
        tempPeriods.push(data[1][a]);
    }

    console.log(tempPeriods);

    Chart.defaults.font.size = 18;
    Chart.defaults.font.family = "Secular One";

    let chart = new Chart(document.getElementById(String(location) + "-loc-hourly-feels-like-chart"), {
        type: 'line',
        data: {
            labels: timePeriods,
            datasets: [{
                label: 'Feels Like',
                data: tempPeriods,
                pointHoverRadius: 20,
                pointHitRadius: 20,
                pointRadius: 7,
                backgroundColor: tempColorPeriods,
                fill: false,
                borderWidth: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (item) =>
                            `${item.dataset.label}: ${item.formattedValue} °F`,
                    },
                }
            },
            tension: 0.4
        }
    });
    drawnCharts[String(location)].push(chart);
    return chart;
}

function makePrecipGraph(location, data){
    let forecastTime;
    let AMPM;

    let timePeriods = [];
    let precipPeriods = [];
    let precipColorPeriods = [];
    const precipColorGradient = chroma.scale(["white", "dodgerblue", "blue"]);

    for (let a = 0; a < 24; a++){
        forecastTime = data[a]["startTime"];
        forecastTime = parseInt(forecastTime.substr(11,2));
        AMPM = "AM";
        if (forecastTime > 11){
            AMPM = "PM";
        }
        if (forecastTime > 12){
            forecastTime -= 12;
        }
        if (forecastTime == 0){
            forecastTime = 12;
        }

        timePeriods.push(forecastTime.toString() + " " + AMPM);
        // Generate graph colors and data
        precipColorPeriods.push(precipColorGradient(data[a]["probabilityOfPrecipitation"]["value"]/100).hex());
        precipPeriods.push(data[a]["probabilityOfPrecipitation"]["value"]);
    }

    Chart.defaults.font.size = 18;
    Chart.defaults.font.family = "Secular One";

    let chart = new Chart(document.getElementById(String(location) + "-loc-hourly-precip-chart"), {
        type: 'line',
        data: {
            labels: timePeriods,
            datasets: [{
                label: 'Chance of Precipitation',
                data: precipPeriods,
                pointHoverRadius: 20,
                pointHitRadius: 20,
                pointRadius: 7,
                backgroundColor: precipColorPeriods,
                fill: false,
                borderWidth: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (item) =>
                            `${item.dataset.label}: ${item.formattedValue}%`,
                    },
                }
            },
            tension: 0.4
        }
    });
    drawnCharts[String(location)].push(chart);
    return chart;
}

function makeHumidGraph(location, data){
    let forecastTime;
    let AMPM;

    let timePeriods = [];
    let humidityPeriods = [];
    let humidityColorPeriods = [];
    const humidityColorGradient = chroma.scale(["white", "yellow"]);

    for (let a = 0; a < 24; a++){
        forecastTime = data[a]["startTime"];
        forecastTime = parseInt(forecastTime.substr(11,2));
        AMPM = "AM";
        if (forecastTime > 11){
            AMPM = "PM";
        }
        if (forecastTime > 12){
            forecastTime -= 12;
        }
        if (forecastTime == 0){
            forecastTime = 12;
        }

        timePeriods.push(forecastTime.toString() + " " + AMPM);
        // Generate graph colors and data
        humidityColorPeriods.push(humidityColorGradient(data[a]["relativeHumidity"]["value"]/100).hex());
        humidityPeriods.push(data[a]["relativeHumidity"]["value"]);
    }

    Chart.defaults.font.size = 18;
    Chart.defaults.font.family = "Secular One";

    let chart = new Chart(document.getElementById(String(location) + "-loc-hourly-humid-chart"), {
        type: 'line',
        data: {
            labels: timePeriods,
            datasets: [{
                label: 'Relative Humidity',
                data: humidityPeriods,
                pointHoverRadius: 20,
                pointHitRadius: 20,
                pointRadius: 7,
                backgroundColor: humidityColorPeriods,
                fill: false,
                borderWidth: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (item) =>
                            `${item.dataset.label}: ${item.formattedValue}%`,
                    },
                }
            },
            tension: 0.4
        }
    });
    drawnCharts[String(location)].push(chart);
    return chart;
}

function makeWindGraph(location, data){
    let forecastTime;
    let AMPM;

    let timePeriods = [];
    let windPeriods = [];
    let windDirectionPeriods = [];
    let windColorPeriods = [];
    const windSpeedGradient = chroma.scale(["white", "deeppink"]);
    let lastWindDir = "";
    let lastWindDirChange = -10;

    for (let a = 0; a < 24; a++){
        forecastTime = data[a]["startTime"];
        forecastTime = parseInt(forecastTime.substr(11,2));
        AMPM = "AM";
        if (forecastTime > 11){
            AMPM = "PM";
        }
        if (forecastTime > 12){
            forecastTime -= 12;
        }
        if (forecastTime == 0){
            forecastTime = 12;
        }

        data[a]["windDirection"] = data[a]["windDirection"].substring(data[a]["windDirection"].length-2, data[a]["windDirection"].length);
        // Decide on wind direction icon
        if (a > 0 && data[a]["windDirection"] !== lastWindDir){
            // Shorten wind direction to 2 letters
            let colorScheme = window.appTheme;
            let imageObj = new Image();
            imageObj.src = colorScheme === "dark" ? "img/directions/"+data[a]["windDirection"]+".svg" : "img/directions/"+data[a]["windDirection"]+"-adaptive.svg";
            windDirectionPeriods.push(imageObj);
            lastWindDir = data[a]["windDirection"];
            lastWindDirChange = a;
        }
        else{
            windDirectionPeriods.push(null);
        }
        timePeriods.push(forecastTime.toString() + " " + AMPM);
        // Generate graph colors and data
        windPeriods.push(Number(data[a]["windSpeed"].replace(" mph", "")));
        windColorPeriods.push(windSpeedGradient(Number(data[a]["windSpeed"].replace(" mph", ""))/25).hex());
    }

    Chart.defaults.font.size = 18;
    Chart.defaults.font.family = "Secular One";

    let chart = new Chart(document.getElementById(String(location) + "-loc-hourly-wind-chart"), {
        type: 'line',
        data: {
            labels: timePeriods,
            datasets: [{
                label: 'Wind Speed',
                data: windPeriods,
                pointHoverRadius: 20,
                pointHitRadius: 20,
                pointRadius: 7,
                backgroundColor: windColorPeriods,
                pointStyle: windDirectionPeriods,
                fill: false,
                borderWidth: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (item) =>
                            `${item.dataset.label}: ${item.formattedValue} mph`,
                    },
                }
            },
            tension: 0.4
        }
    });
    drawnCharts[String(location)].push(chart);
    return chart;
}