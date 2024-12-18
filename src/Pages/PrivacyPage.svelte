<script>
    import TabSlot from "../Layout/TabSlot.svelte";

    let { page = $bindable() } = $props();
</script>

<TabSlot name="privacy" bind:page={page}>
    <h1>Privacy Statement</h1>
    <hr>
    <h2>Atmos Weather takes privacy very seriously and only uses data that is necessary to provide you with convenient, accurate weather information.</h2>

    <br>
    <details>
        <summary>Privacy Commitment</summary>
        Atmos Weather is committed to protecting user privacy and never using data for more than what is
        strictly necessary to provide weather information and alerts. Atmos Weather aims to always be
        transparent about what data is collected and how it is used. Atmos Weather is open source and the
        source can be found at https://github.com/atticuscornett/AtmosWeather. If you have any questions,
        concerns, or suggestions, please reach out via GitHub issues.
    </details>
    <details>
        <summary>User Data Usage</summary>
        Atmos Weather does not collect any user data for tracking or advertising purposes.<br>
        Atmos Weather connects to several APIs to provide weather information and alerts.<br>
        The following is a list of all the services used to power Atmos Weather and what information they receive:<br>
        <h3><b>National Weather Service API</b></h3>
        <h4>Domain(s): api.weather.gov</h4>
        <h4>Information: GPS Location (when app is open and in background), Saved Locations (when app is open and in background), IP Address (when app is open and in background)</h4>
        <h4>Why: The National Weather Service provides the forecast information displayed in the app and provides weather alerts in the background.</h4>
        <br>
        <h3><b>Open-Meteo</b></h3>
        <h4>Domain(s): air-quality-api.open-meteo.com, api.open-meteo.com</h4>
        <h4>Information: GPS Location (when app is open), Saved Locations (when app is open), IP Address (when app is open)</h4>
        <h4>Why: Open-Meteo provides additional weather data (such as AQI and apparent temperature) displayed on location pages.</h4>
        <br>
        <h3><b>OpenStreetMap</b></h3>
        <h4>Domain(s): tile.openstreetmap.org, nominatim.opensteetmap.org</h4>
        <h4>Information: Location Searches (when app is open), IP Address (when app is open)</h4>
        <h4>Why: OpenStreetMap's Nominatim API powers the location search feature and OpenStreetMap's tile servers provide the map tiles used for the radar and alerts.</h4>
        <br>
        <h3><b>RainViewer</b></h3>
        <h4>Domain(s): tilecache.rainviewer.com</h4>
        <h4>Information: IP Address (when app is open)</h4>
        <h4>Why: RainViewer provides the radar imagery displayed on the radar page.</h4>
        <br>
        <h3><b>NOAA Map Services</b></h3>
        <h4>Domain(s): mapservices.weather.noaa.gov</h4>
        <h4>Information: IP Address (when app is open)</h4>
        <h4>Why: NOAA provides the SPC outlooks that are displayed on the radar page.</h4>
        <br>
        <h3><b>GitHub Releases</b></h3>
        <h4>Domain(s): github.com, api.github.com</h4>
        <h4>Information: IP Address (when app is open)</h4>
        <h4>Why: Used to check for updates (on mobile) and to automatically download and update to the latest version of Atmos Weather (on desktop).</h4>
        <br>
        <h3><b>Atmos Weather GitHub Site</b></h3>
        <h4>Domain(s): atticuscornett.github.io</h4>
        <h4>Information: IP Address (when app is open)</h4>
        <h4>Why: The Atmos Weather site hosts county polygon shapes that are displayed on maps.</h4>
    </details>
    <details>
        <summary>Android Permissions</summary>
        Atmos Weather for Android uses the following permissions:<br>
        <h3>Location Permissions</h3>
        <code>ACCESS_COARSE_LOCATION</code> is used to get the user's approximate location for weather information and alerts.<br>
        <code>ACCESS_FINE_LOCATION</code> is used to get the user's location for weather information and alerts with greater precision.<br>
        <code>ACCESS_BACKGROUND_LOCATION</code> is used to get the user's location in the background for weather alerts at the current position.<br>
        <h3>Network Permissions</h3>
        <code>INTERNET</code> is used to connect to the internet to get weather information and alerts.<br>
        <code>ACCESS_NETWORK_STATE</code> is used to check if the device is connected to the internet
        and optimize background usage based on whether the device is using mobile data or Wi-Fi.<br>
        <h3>Other Permissions</h3>
        <code>POST_NOTIFICATIONS</code> is used to display notifications for weather alerts for devices running Android 13 or higher.<br>
        <code>REQUEST_IGNORE_BATTERY_OPTIMIZATIONS</code> is used to request an exemption from battery optimizations to run in the background and ensure that weather alerts are given in a timely manner.<br>
        <code>SCHEDULE_EXACT_ALARM</code> is used to periodically run weather alert checks in the background.
        The alarms must be exact to ensure that alerts are given in a timely manner.<br>
        <code>RECEIVE_BOOT_COMPLETED</code> is used to restart the weather alert checks after the device is rebooted.<br>
        <code>DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION</code> is automatically added by the Android build process
        for apps with broadcast receivers targeting Android 13 or higher.
    </details>
</TabSlot>