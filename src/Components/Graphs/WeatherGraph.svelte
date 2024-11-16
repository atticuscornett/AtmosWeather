<script>
    let { chartList, title, location, colorGradient,
        labelCallback, iconCallback, gradientCallback, dataCallback, scale=false, startAtZero=false, uniqueName } = $props();

    let thisChart;

    $effect(() => {
        thisChart = Chart.getChart(String(location) + "-loc-"+title+uniqueName+"-chart");
        if (thisChart){
            thisChart.destroy();
        }

        let forecastTime;
        let AMPM;
        let timePeriods = [];
        let tempPeriods = [];
        let imagePeriods = [];
        let tempColorPeriods = [];
        const tempColorGradient = chroma.scale(colorGradient);
        let lastImage = "";
        let lastImageChange = -10;
        let image;

        for (let i = 0; i < 24; i++){
            // Decide on weather icon
            // sfor = data[a]["shortForecast"].toLowerCase();
            // if (sfor.includes("rain") || sfor.includes("drizzle")){
            //     image = "rainy";
            // }
            // else if (sfor.includes("tornado") || sfor.includes("storm") || sfor.includes("water spout")){
            //     image = "stormy";
            // }
            // else if (sfor.includes("snow")){
            //     image = "snowy";
            // }
            // else if (sfor.includes("wind")){
            //     image = "windy";
            // }
            // else if (sfor.includes("cloud") || sfor.includes("fog")){
            //     image = "cloudy";
            // }
            // else{
            //     image = "sunny";
            // }

            image = iconCallback(chartList, i);

            // Convert time to 12-hour format
            forecastTime = chartList[i]["startTime"];
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

            if (i > 0 && image !== lastImage && lastImageChange + 2 < i){
                let colorScheme = window.appTheme;
                let imageObj = new Image();
                imageObj.src = colorScheme === "dark" ? "img/"+image+".svg" : "img/"+image+"-adaptive.svg";
                imagePeriods.push(imageObj);
                lastImage = image;
                lastImageChange = i;
            }
            else{
                imagePeriods.push(null);
            }
            timePeriods.push(forecastTime.toString() + " " + AMPM);
            // Generate graph colors and data
            tempColorPeriods.push(tempColorGradient(gradientCallback(chartList, i)).hex());
            tempPeriods.push(dataCallback(chartList, i));
        }

        Chart.defaults.font.size = 18;
        Chart.defaults.font.family = "Secular One";

        let chartConfig = {
            type: 'line',
            data: {
                labels: timePeriods,
                datasets: [{
                    label: title,
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
                            label: labelCallback,
                        },
                    }
                },
                tension: 0.4
            }
        };

        if (image !== ""){
            chartConfig.data.datasets[0].pointStyle = imagePeriods;
        }

        if (startAtZero){
            chartConfig.options.scales = {
                y: {
                    beginAtZero: true
                }
            };
        }

        if (scale){
            chartConfig.options.scales = {
                y: {
                    beginAtZero: true,
                        min: 0,
                        max: 100,
                        ticks: {
                        stepSize: 20
                    }
                }
            };
        }

        if (title === "Feels Like"){
            console.log(chartConfig);
        }

        let chart = new Chart(document.getElementById(String(location) + "-loc-"+title+uniqueName+"-chart"),
            chartConfig);
    })
</script>

<div class='weatherGraph' >
    <canvas id={location + "-loc-" + title + uniqueName+"-chart"}></canvas>
</div>

<style>
    .weatherGraph{
        position: relative;
        max-height: 50vh;
        min-height: 40vh;
    }
</style>
