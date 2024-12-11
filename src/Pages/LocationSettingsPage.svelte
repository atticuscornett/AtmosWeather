<script>
    import TabSlot from "../Layout/TabSlot.svelte";

    let { page = $bindable(), locationData } = $props();

    let allSettings = $state(JSON.parse(localStorage.getItem("atmos-settings")));
    let locationNames = $state(JSON.parse(localStorage.getItem("weather-location-names")));

    let platform = $state(false);
    let webVersionWarning = $derived(platform === "pwa");
    let isDesktop = $derived(platform && platform.includes("desktop"));
    let locationSettings = $state(generateSettings());

    function generateSettings(){
        console.log("Generating settings");
        let settings = {"notifications":{}, "location-alerts":{}, "alert-types":{"warnings":{}, "watches":{}, "advisory":{}}};
        settings["notifications"]["severe-future"] = getSettingsForLocation(["notifications", "severe-future"]);
        settings["notifications"]["rain-future"] = getSettingsForLocation(["notifications", "rain-future"]);
        settings["location-alerts"]["tts-alerts"] = getSettingsForLocation(["location-alerts", "tts-alerts"]);
        settings["location-alerts"]["default-alert"] = getSettingsForLocation(["location-alerts", "default-alert"]);
        settings["location-alerts"]["default-notification"] = getSettingsForLocation(["location-alerts", "default-notification"]);

        let warningTypes = Object.keys(allSettings["alert-types"]["warnings"]);
        let watchTypes = Object.keys(allSettings["alert-types"]["watches"]);
        let advisoryTypes = Object.keys(allSettings["alert-types"]["advisory"]);

        for (let i = 0; i < warningTypes.length; i++){
            settings["alert-types"]["warnings"][warningTypes[i]] = getSettingsForLocation(["alert-types", "warnings", warningTypes[i]]);
        }

        for (let i = 0; i < watchTypes.length; i++){
            settings["alert-types"]["watches"][watchTypes[i]] = getSettingsForLocation(["alert-types", "watches", watchTypes[i]]);
        }

        for (let i = 0; i < advisoryTypes.length; i++){
            settings["alert-types"]["advisory"][advisoryTypes[i]] = getSettingsForLocation(["alert-types", "advisory", advisoryTypes[i]]);
        }
        console.log("Generated settings :");
        console.log(settings);
        return settings;
    }

    function refreshSettings() {
        allSettings = JSON.parse(localStorage.getItem("atmos-settings"));
        allSettings["radar"]["color-scheme"] = String(allSettings["radar"]["color-scheme"]);
        platform = window.platform;
        locationNames = JSON.parse(localStorage.getItem("weather-location-names"));
        locationSettings = generateSettings();
        console.log(locationSettings);
    }

    function playAlarmSoundLocation(){
        let audio = new Audio('audio/' + locationSettings["location-alerts"]["default-alert"] + 'alarm.mp3');
        audio.play();
    }
    function playNotificationSoundLocation(){
        let audio = new Audio('audio/' + locationSettings["location-alerts"]["default-notification"] + 'notification.mp3');
        audio.play();
    }

    function getSettingsForLocation(properties){
        let settingResult = allSettings;

        if (!settingResult.hasOwnProperty("per-location")){
            settingResult["per-location"] = {};
        }

        if (!settingResult["per-location"].hasOwnProperty(locationData.name)){
            settingResult["per-location"][locationData.name] = {"notifications":{}, "location-alerts":{}, "alert-types":{"warnings":{}, "watches":{}, "advisory":{}}};
        }

        let locationSettings = settingResult["per-location"][locationData.name];
        if (getKeys(properties, locationSettings)){
            return getKeys(properties, locationSettings);
        }
        else{
            return getKeys(properties, allSettings);
        }
    }

    function getKeys(properties, obj){
        let object = structuredClone($state.snapshot(obj));
        for (let i = 0; i < properties.length; i++){
            if (object.hasOwnProperty(properties[i])){
                object = object[properties[i]];
            }
            else{
                return null;
            }
        }
        return object;
    }

    function saveSettings() {
        console.log(allSettings);
        let settingsSave = structuredClone($state.snapshot(allSettings));
        settingsSave["radar"]["color-scheme"] = Number(settingsSave["radar"]["color-scheme"]);
        refreshAppTheme();

        let notificationSettings = {};
        for (let i in locationSettings["notifications"]){
            if (locationSettings["notifications"][i] !== allSettings["notifications"][i]){
                notificationSettings[i] = locationSettings["notifications"][i];
            }
        }

        let locationAlertSettings = {};
        for (let i in locationSettings["location-alerts"]){
            if (locationSettings["location-alerts"][i] !== allSettings["location-alerts"][i]){
                locationAlertSettings[i] = locationSettings["location-alerts"][i];
            }
        }

        let warningSettings = {};
        for (let i in locationSettings["alert-types"]["warnings"]){
            if (locationSettings["alert-types"]["warnings"][i] !== allSettings["alert-types"]["warnings"][i]){
                warningSettings[i] = locationSettings["alert-types"]["warnings"][i];
            }
        }

        let watchSettings = {};
        for (let i in locationSettings["alert-types"]["watches"]){
            if (locationSettings["alert-types"]["watches"][i] !== allSettings["alert-types"]["watches"][i]){
                watchSettings[i] = locationSettings["alert-types"]["watches"][i];
            }
        }

        let advisorySettings = {};
        for (let i in locationSettings["alert-types"]["advisory"]){
            if (locationSettings["alert-types"]["advisory"][i] !== allSettings["alert-types"]["advisory"][i]){
                advisorySettings[i] = locationSettings["alert-types"]["advisory"][i];
            }
        }

        settingsSave["per-location"][locationData.name] = {
            "notifications": notificationSettings,
            "location-alerts": locationAlertSettings,
            "alert-types": {
                "warnings": warningSettings,
                "watches": watchSettings,
                "advisory": advisorySettings
            }
        };

        window.locationEnabled = allSettings["location"]["weather"];
        localStorage.setItem("atmos-settings", JSON.stringify(settingsSave));
    }

    function ensureSettingsSet(){
        allSettings = JSON.parse(localStorage.getItem("atmos-settings"));
        if (!allSettings){
            setTimeout(ensureSettingsSet, 100);
        }
        if (!allSettings["per-location"].hasOwnProperty(locationData.name)){
            allSettings["per-location"][locationData.name] = {"notifications":{}, "location-alerts":{}, "alert-types":{"warnings":{}, "watches":{}, "advisory":{}}};
        }
    }

    function formatTitle(title, ending){
        title = title.split("-");
        for (let i in title){
            title[i] = title[i][0].toUpperCase() + title[i].substring(1)
        }
        title = title.join(" ");
        if (title.includes("Outlook") || title.includes("Statement")){
            return title;
        }
        else{
            return title + " " + ending;
        }
    }

    ensureSettingsSet();
</script>

<TabSlot name="settings-{locationData.name}" bind:page={page} onOpen={refreshSettings}>
    <h1>Alert Settings for {locationData.name}</h1>
    {#if webVersionWarning}
        <h2>Some settings/features are not functional on the web version, including weather alerts.</h2>
    {/if}

    <hr>
    {#if locationSettings}
        <div onchange={saveSettings}>
        <h2>Notifications</h2>
        <input class="box" type="checkbox" id="setting-future-severe-notifications-{locationData.name}" bind:checked={locationSettings["notifications"]["severe-future"]}>
        <label for="setting-future-severe-notifications-{locationData.name}">Get notifications for forecast future severe weather</label>
        <br>
        <input class="box" type="checkbox" id="setting-future-storm-notifications-{locationData.name}" bind:checked={locationSettings["notifications"]["rain-future"]}>
        <label for="setting-future-storm-notifications-{locationData.name}">Get notifications for forecast future storms and rain (not severe)</label>
        <hr>
        <h2>Sounds</h2>
        <input class="box" type="checkbox" id="setting-tts-alerts-{locationData.name}" bind:checked={locationSettings["location-alerts"]["tts-alerts"]}>
        <label for="setting-tts-alerts-{locationData.name}">Read alerts with text to speech</label>
        <br><br>
        <label for="setting-default-sound-alert-{locationData.name}">Default Alert Sound</label>
        <br>
        <select id="setting-default-sound-alert-{locationData.name}" onchange={playAlarmSoundLocation} bind:value={locationSettings["location-alerts"]["default-alert"]}>
            <option value="readynow">ReadyNow Warning</option>
            <option value="suremind">SureMind Warning</option>
            <option value="alternatingtones">Alternating Tones</option>
            <option value="simplebeeps">Simple Beeps</option>
        </select>
        <br>
        <label for="setting-default-sound-notification-{locationData.name}">Default Notification Sound</label>
        <br>
        <select id="setting-default-sound-notification-{locationData.name}" onchange={playNotificationSoundLocation} bind:value={locationSettings["location-alerts"]["default-notification"]}>
            <option value="readynow">ReadyNow Watch</option>
            <option value="suremind">SureMind Watch</option>
            <option value="alternatingtones">Alternating Tones</option>
            <option value="simplebeeps">Simple Beeps</option>
        </select>
        <hr>
        <h2>Alert Types</h2>
        <details>
            <summary>Warnings</summary>
            <div id="settings-warnings-list">
                {#each Object.entries(locationSettings["alert-types"]["warnings"]) as [key, value]}
                    <label for="setting-warning-{key}">{formatTitle(key, "Warning")}</label>
                    <br>
                    <select bind:value={locationSettings["alert-types"]["warnings"][key]}>
                        <option value="alert">Alert</option>
                        {#if !isDesktop}
                            <option value="alertmove">Alert if moving</option>
                        {/if}
                        <option value="soundnotification">Sound Notification</option>
                        <option value="silentnotification">Silent Notification</option>
                        <option value="nothing">Nothing</option>
                    </select>
                    <br>
                {/each}
            </div>
        </details>
        <details>
            <summary>Watches</summary>
            <div id="settings-watches-list">
                {#each Object.entries(locationSettings["alert-types"]["watches"]) as [key, value]}
                    <label for="setting-watch-{key}">{formatTitle(key, "Watch")}</label>
                    <br>
                    <select bind:value={locationSettings["alert-types"]["watches"][key]}>
                        <option value="alert">Alert</option>
                        {#if !isDesktop}
                            <option value="alertmove">Alert if moving</option>
                        {/if}
                        <option value="soundnotification">Sound Notification</option>
                        <option value="silentnotification">Silent Notification</option>
                        <option value="nothing">Nothing</option>
                    </select>
                    <br>
                {/each}
            </div>
        </details>
        <details>
            <summary>Advisories/Other</summary>
            <div id="settings-advisory-list">
                {#each Object.entries(locationSettings["alert-types"]["advisory"]) as [key, value]}
                    <label for="setting-watch-{key}">{formatTitle(key, "Advisory")}</label>
                    <br>
                    <select bind:value={locationSettings["alert-types"]["advisory"][key]}>
                        <option value="alert">Alert</option>
                        {#if !isDesktop}
                            <option value="alertmove">Alert if moving</option>
                        {/if}
                        <option value="soundnotification">Sound Notification</option>
                        <option value="silentnotification">Silent Notification</option>
                        <option value="nothing">Nothing</option>
                    </select>
                    <br>
                {/each}
            </div>
        </details>
    </div>
    {/if}
</TabSlot>