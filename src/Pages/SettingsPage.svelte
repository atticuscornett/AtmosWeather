<script>
    import TabSlot from "../Layout/TabSlot.svelte";

    let { page = $bindable() } = $props();

    let allSettings = $state(JSON.parse(localStorage.getItem("atmos-settings")));
    let locationNames = $state(JSON.parse(localStorage.getItem("weather-location-names")));
    let orderedWarnings = $state([]);
    let orderedWatches = $state([]);
    let orderedAdvisories = $state([]);

    let platform = $state(false);
    let webVersionWarning = $derived(platform === "pwa");
    let isDesktop = $derived(platform && platform.includes("desktop"));
    let isAndroid = $derived(platform && platform.includes("android"));

    function refreshSettings() {
        allSettings = JSON.parse(localStorage.getItem("atmos-settings"));
        allSettings["radar"]["color-scheme"] = String(allSettings["radar"]["color-scheme"]);
        platform = window.platform;
        locationNames = JSON.parse(localStorage.getItem("weather-location-names"));
    }

    function playAlarmSoundMain(){
        let audio = new Audio('audio/' + allSettings["location-alerts"]["default-alert"] + 'alarm.mp3');
        audio.play();
    }

    function playNotificationSoundMain(){
        let audio = new Audio('audio/' + allSettings["location-alerts"]["default-notification"] + 'notification.mp3');
        audio.play();
    }

    function saveSettings() {
        let settingsSave = structuredClone($state.snapshot(allSettings));
        localStorage.setItem("atmos-settings", JSON.stringify(settingsSave));
        refreshAppTheme();
        window.locationEnabled = allSettings["location"]["weather"];
    }

    function getWarningsInOrder(){
        let warnings = [];
        for (let key of hazardPriority){
            let formatKey = key.toLowerCase();
            if (formatKey.includes("warning")){
                formatKey = formatKey.replaceAll(" ", "-");
                formatKey = formatKey.replace("-warning", "");
                if (allSettings["alert-types"]["warnings"][formatKey]){
                    warnings.push(formatKey);
                }
            }
        }

        return warnings;
    }

    function getWatchesInOrder(){
        let watches = [];
        for (let key of hazardPriority){
            let formatKey = key.toLowerCase();
            if (formatKey.includes("watch")){
                formatKey = formatKey.replaceAll(" ", "-");
                formatKey = formatKey.replace("-watch", "");
                if (allSettings["alert-types"]["watches"][formatKey]){
                    watches.push(formatKey);
                }
            }
        }

        return watches;
    }

    function getAdvisoriesInOrder(){
        let advisories = [];
        for (let key of hazardPriority){
            let formatKey = key.toLowerCase();
            if (!formatKey.includes("watch") && !formatKey.includes("warning")){
                formatKey = formatKey.replaceAll(" ", "-");
                formatKey = formatKey.replace("-advisory", "");
                if (allSettings["alert-types"]["advisory"][formatKey]){
                    advisories.push(formatKey);
                }
            }
        }

        return advisories;
    }

    function ensureSettingsSet(){
        allSettings = JSON.parse(localStorage.getItem("atmos-settings"));

        if (!allSettings){
            setTimeout(ensureSettingsSet, 100);
        }
        else {
            orderedWarnings = getWarningsInOrder();
            orderedWatches = getWatchesInOrder();
            orderedAdvisories = getAdvisoriesInOrder();
            setInterval(ensureSettingsSet, 1000*60);
        }
    }

    function formatTitle(title, ending){
        title = title.split("-");
        for (let i in title){
            title[i] = title[i][0].toUpperCase() + title[i].substring(1)
        }
        title = title.join(" ");
        if (title.includes("Outlook") || title.includes("Statement") ||
            title.includes("Immediate") || title.includes("Outage") ||
            title.includes("Alert") || title.includes("Danger") ||
            title.includes("Emergency") || title.includes("Forecast") || title.includes("Message")){
            return title;
        }
        else{
            return title + " " + ending;
        }
    }

    ensureSettingsSet();
</script>

<TabSlot name="settings" bind:page={page} onOpen={refreshSettings}>
    {#if page === "settings"}
    <h1>Settings</h1>
    <h6>
        <a href="#" onclick={page = "about"}>About Atmos Weather</a>
        &emsp;
        <a href="#" onclick={page="privacy"}>Privacy Statement</a>
        <br>
        {#if isAndroid}
            <a onclick={showPermissionDialog} href="#">Android Permissions</a>
        {/if}
    </h6>

    {#if webVersionWarning}
        <h2>Some settings/features are not functional on the web version, including weather alerts.</h2>
    {/if}

    <hr>
    {#if allSettings}
        <div onchange={saveSettings}>
        {#if !isDesktop}
        <div id="settings-device-location">
            <h2>Device Location</h2>
            <h6>Settings related to use of your GPS location.</h6>
            <input class="box" type="checkbox" id="setting-current-location" bind:checked={allSettings["location"]["weather"]}>
            <label for="setting-current-location" >Give Weather for Current Location</label>
            <br>
            <input class="box" type="checkbox" id="setting-current-location-alerts" bind:checked={allSettings["location"]["alerts"]}>
            <label for="setting-current-location-alerts">Give Alerts for Current Location</label>
            <hr>
        </div>
        {/if}
        <h2>Personalization</h2>
        <label for="setting-app-theme">App Theme</label>
        <br>
        <select id="setting-app-theme" bind:value={allSettings["personalization"]["theme"]}>
            <option value="system">System Default</option>
            <option value="dark">Dark Theme</option>
            <option value="light">Light Theme</option>
        </select>
        <br>
        <label for="setting-page-transition-duration">Page Transition Duration</label>
        <br>
        <input type="range" min="0" max="3000" step="100" id="setting-page-transition-duration" bind:value={allSettings["personalization"]["page-transition-duration"]}>
        <label id="setting-page-transition-duration-text" for="setting-page-transition-duration">
            {allSettings["personalization"]["page-transition-duration"]}ms
        </label>
        <br><br>
        <input class="box" type="checkbox" id="setting-atmos-logo" bind:checked={allSettings["personalization"]["atmos-logo"]}>
        <label for="setting-atmos-logo">Show Atmos Weather logo on app open</label>
        <br>
        {#if isDesktop}
            <input class="box" type="checkbox" id="setting-run-startup" bind:checked={allSettings["personalization"]["run-startup"]}>
            <label for="setting-run-startup">Run Atmos Weather in background on startup</label>
            <br>
        {/if}
        <input class="box" type="checkbox" id="setting-notify-updates" bind:checked={allSettings["personalization"]["update-notify"]}>
        <label for="setting-notify-updates">Notify of new Atmos Weather versions on launch</label>
        <hr>
        <h2>Notifications</h2>
        <input class="box" type="checkbox" id="setting-future-severe-notifications" bind:checked={allSettings["notifications"]["severe-future"]}>
        <label for="setting-future-severe-notifications">Get notifications for forecast future severe weather</label>
        <br>
        <input class="box" type="checkbox" id="setting-future-storm-notifications" bind:checked={allSettings["notifications"]["rain-future"]}>
        <label for="setting-future-storm-notifications">Get notifications for forecast future storms and rain (not severe)</label>
        <br>
        {#if !isDesktop}
            <input class="box" type="checkbox" id="setting-quiet-hours" bind:checked={allSettings["notifications"]["quiet-hours"]}>
            <label for="setting-quiet-hours">Enable quiet hours</label>
            <h5 class="addInfo">During quiet hours, sound notifications will behave like silent notifications, but alerts will still be shown.</h5>
            <select id="setting-quiet-start" bind:value={allSettings["notifications"]["quiet-start"]} disabled={!allSettings["notifications"]["quiet-hours"]}>
                {#each Array(24) as _, i}
                    <option value={i}>{(i === 0) ? "12" : ((i > 12) ? i - 12 : i)}:00 {(i < 12) ? "am" : "pm"}</option>
                {/each}
            </select>
            -
            <select id="setting-quiet-end" bind:value={allSettings["notifications"]["quiet-end"]} disabled={!allSettings["notifications"]["quiet-hours"]}>
                {#each Array(24) as _, i}
                    <option value={i}>{(i === 0) ? "12" : ((i > 12) ? i - 12 : i)}:00 {(i < 12) ? "am" : "pm"}</option>
                {/each}
            </select>
        {/if}
        <hr>
        <h2>Radar</h2>
        <h6>Radar powered by RainViewer API.</h6>
        <input class="box" type="checkbox" id="setting-radar-show-watches" bind:checked={allSettings["radar"]["polygons"]["watch"]}>
        <label for="setting-radar-show-watches">Show watch polygons on radar</label>
        <br>
        <input class="box" type="checkbox" id="setting-radar-show-advisories" bind:checked={allSettings["radar"]["polygons"]["advisories"]}>
        <label for="setting-radar-show-advisories">Show advisory polygons on radar</label>
        <br>
        <input class="box" type="checkbox" id="setting-radar-show-warnings" bind:checked={allSettings["radar"]["polygons"]["warnings"]}>
        <label for="setting-radar-show-warnings">Show warning polygons on radar</label>
        <br>
        <input class="box" type="checkbox" id="setting-radar-show-outlook" bind:checked={allSettings["radar"]["spc-outlook"]}>
        <label for="setting-radar-show-outlook">Show NOAA/NWS weather outlooks on radar</label>
        <br>
        <input class="box" type="checkbox" id="setting-radar-satellite" bind:checked={allSettings["radar"]["satellite"]}>
        <label for="setting-radar-satellite">Show satellite instead of radar</label>
        <br>
        <input class="box" type="checkbox" id="setting-radar-high-res" bind:checked={allSettings["radar"]["polygons"]["high-res"]}>
        <label for="setting-radar-high-res">Use high resolution polygons (causes lag)</label>
        <br><br>
        <label for="setting-radar-color-scheme">Radar Color Scheme</label>
        <br>
        <select id="setting-radar-color-scheme" bind:value={allSettings["radar"]["color-scheme"]}>
            <option value="0">Black & White</option>
            <option value="1">Original</option>
            <option value="2">Universal Blue</option>
            <option value="3">TITAN</option>
            <option value="4">TWC</option>
            <option value="5">Meteored</option>
            <option value="6">NEXRAD Level III</option>
            <option value="7">Rainbow</option>
            <option value="8">Dark Sky</option>
        </select>
        <hr>
        <h2>Location Alerts</h2>
        <h6>Choose the level of alerts for different locations.</h6>
        <input class="box" type="checkbox" id="setting-tts-alerts" bind:checked={allSettings["location-alerts"]["tts-alerts"]}>
        <label for="setting-tts-alerts">Read alerts with text to speech</label>
        <br><br>
        <label for="setting-alert-check-frequency">Alert Check Frequency</label>
        <br>
        <select id="setting-alert-check-frequency" bind:value={allSettings["location-alerts"]["alert-check-frequency"]}>
            <option value="15">Every 15 seconds</option>
            <option value="30">Every 30 seconds</option>
            <option value="60">Every 1 minute</option>
            <option value="120">Every 2 minutes</option>
        </select>
        <h6 style="margin-top:5px;">More frequent checks means faster alerts but more battery usage.</h6>
        <label for="setting-default-sound-alert">Default Alert Sound</label>
        <br>
        <select id="setting-default-sound-alert" onchange={playAlarmSoundMain} bind:value={allSettings["location-alerts"]["default-alert"]}>
            <option value="readynow">ReadyNow Warning</option>
            <option value="suremind">SureMind Warning</option>
            <option value="alternatingtones">Alternating Tones</option>
            <option value="simplebeeps">Simple Beeps</option>
        </select>
        <br>
        <label for="setting-default-sound-notification">Default Notification Sound</label>
        <br>
        <select id="setting-default-sound-notification" onchange={playNotificationSoundMain} bind:value={allSettings["location-alerts"]["default-notification"]}>
            <option value="readynow">ReadyNow Watch</option>
            <option value="suremind">SureMind Watch</option>
            <option value="alternatingtones">Alternating Tones</option>
            <option value="simplebeeps">Simple Beeps</option>
        </select>
        <div id="location-settings-div">
            {#each locationNames as name, i}
                <h2><a href='#' onclick={()=>{page = "settings-" + name}}>{name} Alert Settings</a></h2>
            {/each}
        </div>
        <hr>
        <h2>Alert Types</h2>
        <h6>Choose the level of alerts for different types of events. Overridden if location priority is lower.<br>Alert if moving alerts you if the app detects you are in a vehicle.<br>If location permission is not allowed, will always alert.</h6>
        <details>
            <summary>Warnings</summary>
            <div id="settings-warnings-list">
                {#each orderedWarnings as key}
                    <label for="setting-warning-{key}">{formatTitle(key, "Warning")}</label>
                    <br>
                    <select bind:value={allSettings["alert-types"]["warnings"][key]}>
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
                {#each orderedWatches as key}
                    <label for="setting-watch-{key}">{formatTitle(key, "Watch")}</label>
                    <br>
                    <select bind:value={allSettings["alert-types"]["watches"][key]}>
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
                {#each orderedAdvisories as key}
                    <label for="setting-watch-{key}">{formatTitle(key, "Advisory")}</label>
                    <br>
                    <select bind:value={allSettings["alert-types"]["advisory"][key]}>
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
    {/if}
</TabSlot>

<style>
    .addInfo {
        margin-top: 5px;
        margin-left: 5px;
    }
</style>