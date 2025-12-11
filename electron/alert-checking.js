let {Notification} = require("electron");
let turf = require("@turf/turf");

let notifiedAlerts = [];

function alertCheck(location, alert, at, playedAlready){
    let cycleAt = locationNames.indexOf(location);
    console.log(cycleAt);

    // Get Alert Settings
    if (!notifiedAlerts.includes(alert["id"])){
        // Determine Event Type
        let eventType = alert["properties"]["event"];
        let notificationSetting;
        let notificationSound = settings["location-alerts"]["default-notification"];
        let alertSound = settings["location-alerts"]["default-alert"];
        eventType = eventType.toLowerCase().replaceAll(" ", "-");
        eventType = transformEventType(eventType);
        console.log(eventType);

        //Get text-to-speech setting and notification setting
        let tts = settings["location-alerts"]["tts-alerts"];
        if (eventType.includes("warning")){
            notificationSetting = settings["alert-types"]["warnings"][eventType.replace("-warning", "")];
        }
        else if (eventType.includes("watch")){
            notificationSetting = settings["alert-types"]['watches'][eventType.replace("-watch", "")];
        }
        else{
            notificationSetting = settings["alert-types"]["advisory"][eventType.replace("-advisory", "")];
        }

        // Check if location specific settings exist
        if (settings["per-location"][locationNames[cycleAt]] !== undefined){
            let currentLocAlertTypes = settings["per-location"][locationNames[cycleAt]]["alert-types"];
            if (eventType.includes("warning")){
                if (currentLocAlertTypes["warnings"][eventType.replace("-warning", "")] !== undefined){
                    notificationSetting = currentLocAlertTypes["warnings"][eventType.replace("-warning", "")];
                }
            }
            else if (eventType.includes("watches")){
                if (currentLocAlertTypes["watches"] !== undefined){
                    notificationSetting = currentLocAlertTypes["watches"][eventType.replace("-watch", "")];
                }
                notificationSetting = settings["alert-types"]["watches"][eventType.replace("-watch", "")];
            }
            else{
                if (currentLocAlertTypes["advisory"][eventType.replace("-advisory", "")] !== undefined){
                    notificationSetting = currentLocAlertTypes["advisory"][eventType.replace("-advisory", "")];
                }
            }

            // Check for location specific sounds
            if (settings["per-location"][locationNames[cycleAt]]["location-alerts"]["default-notification"] !== undefined){
                notificationSound = settings["per-location"][locationNames[cycleAt]]["location-alerts"]["default-notification"];
            }
            if (settings["per-location"][locationNames[cycleAt]]["location-alerts"]["default-alert"] !== undefined){
                alertSound = settings["per-location"][locationNames[cycleAt]]["location-alerts"]["default-alert"];
            }
        }
        if (notificationSetting === undefined){
            notificationSetting = "soundnotification";
        }

        let notif;
        if (notificationSetting === "alert"){
            // Check for location specific tts setting
            if (settings["per-location"][locationNames[cycleAt]] !== undefined){
                if (settings["per-location"][locationNames[cycleAt]]["location-alerts"] !== undefined){
                    if (settings["per-location"][locationNames[cycleAt]]["location-alerts"]["tts-alerts"] !== undefined){
                        tts = settings["per-location"][locationNames[cycleAt]]["location-alerts"]["tts-alerts"];
                    }
                }
            }

            // Show alert notification
            notif = new Notification({ title: alert["properties"]["event"] + " issued for " + locationNames[cycleAt], body: alert["properties"]["description"], urgency: "critical", timeoutType: 'never', silent: true, sound: __dirname + "/audio/readynownotification.mp3", icon: __dirname + "/img/warning.png"});
            notif.show()
            notif.on('click', loadAlertDetails.bind(null, {"locationName":locationNames[cycleAt], "at":at}))
            mainWindow.webContents.executeJavaScript("var audio = new Audio('audio/" + alertSound + "extended.mp3');audio.play();allAudio.push(audio);", false);
            notif.on('close', () => {mainWindow.webContents.executeJavaScript("stopAllAudio();", false)});
            if (tts){
                ttsTask(alert["properties"]["headline"] + ". " + alert["properties"]["description"].replaceAll("'", "\\'"));
            }
        }
        else if (notificationSetting === "silentnotification"){
            // Show silent alert notification
            notif = new Notification({ title: alert["properties"]["event"] + " issued for " + locationNames[cycleAt], body: alert["properties"]["description"], urgency: "critical", timeoutType: 'never', silent: true, sound: __dirname + "/audio/readynownotification.mp3", icon: __dirname + "/img/alerts.png"});
            notif.show()
            notif.on('click', loadAlertDetails.bind(null, {"locationName":locationNames[cycleAt], "at":at}))
        }
        else if (notificationSetting === "soundnotification"){
            // Show sound notification
            if (alert["properties"]["event"].toLowerCase().includes("watch")){
                notif = new Notification({ title: alert["properties"]["event"] + " issued for " + locationNames[cycleAt], body: alert["properties"]["description"], silent: true, icon: __dirname + "/img/watch.png"});
                notif.show()
                notif.on('click', loadAlertDetails.bind(null, {"locationName":locationNames[cycleAt], "at":at}))
                notif.on('close', () => {mainWindow.webContents.executeJavaScript("stopAllAudio();", false)});
            }
            else{
                notif = new Notification({ title: alert["properties"]["event"] + " issued for " + locationNames[cycleAt], body: alert["properties"]["description"], silent: true, icon: __dirname + "/img/alerts.png"});
                notif.show()
                notif.on('click', loadAlertDetails.bind(null, {"locationName":locationNames[cycleAt], "at":at}))
                notif.on('close', () => {mainWindow.webContents.executeJavaScript("stopAllAudio();", false)});
            }


            if (!playedAlready.includes(notificationSound)){
                mainWindow.webContents.executeJavaScript("var audio = new Audio('audio/" + notificationSound + "notification.mp3');audio.play();allAudio.push(audio);", false);
                playedAlready.push(notificationSound);
            }
        }
        console.log(notificationSetting);
        notifiedAlerts.push(alert["id"]);
    }
}

function transformEventType(eventType){
    if (eventType.includes("Red Flag Warning")){
        eventType = "Fire Weather Warning";
    }

    if (eventType.endsWith("statement") || eventType.endsWith("outlook")){
        eventType = eventType + "-advisory";
    }

    if (eventType === "coastal-flood-statement-advisory"){
        eventType = "coastal-flood-advisory";
    }

    if (eventType === "air-quality-alert"){
        eventType = "air-quality-warning";
    }
    return eventType;
}

function ttsTask(toSay){
    setTimeout(function(){
        mainWindow.webContents.executeJavaScript("stopAllAudio();", false);
        toSay = toSay.replaceAll("\n", " ")
        console.log(toSay);
        mainWindow.webContents.executeJavaScript("sayTTS('" +  toSay + "');", false);
    }, 3000);
}

function getAllUGCCodes(){
    let areaList = [];
    console.log(JSON.stringify(locationNames));
    for (let key of locationNames){
        try {
            let location = JSON.parse(locationCache[key]);
            let ugcCode = location["properties"]["county"];
            let ugcCode2 = location["properties"]["forecastZone"];
            let ugcCode3 = location["properties"]["fireWeatherZone"];
            if (ugcCode !== undefined && areaList.includes(ugcCode.split("/").pop()) === false) {
                areaList.push(ugcCode.split("/").pop());
            }
            if (ugcCode2 !== undefined && areaList.includes(ugcCode2.split("/").pop()) === false) {
                areaList.push(ugcCode2.split("/").pop());
            }
            if (ugcCode3 !== undefined && areaList.includes(ugcCode3.split("/").pop()) === false) {
                areaList.push(ugcCode3.split("/").pop());
            }
        }
        catch(e) {
            console.log("Skipping " + key + " due to error: " + e);
        }
    }
    return areaList;
}

function areaAlertURL(){
    let areaList = getAllUGCCodes();
    return "https://api.weather.gov/alerts/active?zone=" + areaList.join(",");
}

function checkPolygons(){
    fetch(areaAlertURL()).then(response => response.json()).then(data => {
        console.log("Checking polygons.")
        let alerts = data["features"];
        let alertsAtLocation = {};
        for (let alert of alerts){
            let playedAlready = [];
            let alertAt = 0;
            let alertLocation = determineAlertLocation(alert);
            if (alertLocation === null){
                continue;
            }
            if (alertsAtLocation[alertLocation] !== undefined){
                alertAt = alertsAtLocation[alertLocation];
            }
            console.log(alertLocation);
            alertCheck(alertLocation, alert, alertAt, playedAlready);
            alertAt++;
            alertsAtLocation[alertLocation] = alertAt;
        }

    });
}

function determineAlertLocation(alert){
    if (alert["geometry"] !== null){
        let polygon = alert["geometry"];
        let i = 0;
        for (let item of weatherLocations){
            let point = turf.point([item["lon"], item["lat"]]);
            if (turf.booleanPointInPolygon(point, polygon)){
                return locationNames[i];
            }
            i++;
        }
        return null;
    }
    else {
        let zones = alert["properties"]["affectedZones"];
        for (let zone of zones){
            for (let item of locationNames){
                let location = JSON.parse(locationCache[item]);
                let ugcCode = location["properties"]["county"];
                let ugcCode2 = location["properties"]["forecastZone"];
                let ugcCode3 = location["properties"]["fireWeatherZone"];
                if (ugcCode === zone || ugcCode2 === zone || ugcCode3 === zone){
                    return item;
                }
            }
        }
        return null;
    }
}

module.exports = {checkPolygons};