<script>
    import TabSlot from "../Layout/TabSlot.svelte";

    let { page = $bindable() } = $props();
</script>

<TabSlot name="about" bind:page={page}>
    <h1>About Atmos Weather</h1>
    <h3 id="atmos-app-version">Version {window.atmosVersion}</h3>
    <h3 id="atmos-app-updated">Updated on {window.atmosUpdated}</h3>
    <h6>Written by Atticus Cornett and <a href="https://github.com/atticuscornett/AtmosWeather/graphs/contributors" target="_blank">contributors</a></h6>
    <hr>
    <br>
    <details>
        <summary>Update Notes</summary>
        <h4>{@html window.atmosUpdateNotes}</h4>
    </details>
    <br>
    <h2>Resources</h2>
    <h3><a href="https://capacitorjs.com/" target="_blank">CapacitorJS (Android App)</a></h3>
    <h3><a href="https://github.com/TheCocoaProject/cordova-plugin-nativestorage" target="_blank">Cordova NativeStorage Plugin (Android App)</a></h3>
    <h3><a href="https://www.electronjs.org/" target="_blank">ElectronJS (Desktop Apps)</a></h3>
    <h3><a href="https://fonts.google.com/" target="_blank">Google Fonts (Fonts)</a></h3>
    <h3><a href="https://leafletjs.com/index.html" target="_blank">LeafletJS (Maps)</a></h3>
    <h3><a href="https://www.weather.gov/documentation/services-web-api" target="_blank">NWS API (Weather Data)</a></h3>
    <h3><a href="https://open-meteo.com/" target="_blank">Open-Meteo API (Weather Data)</a></h3>
    <h3><a href="https://nominatim.org/" target="_blank">OSM Nominatim (Location Search)</a></h3>
    <h3><a href="https://storyset.com/people" target="_blank">Storyset (Illustrations)</a></h3>
    <h3><a href="https://svelte.dev/" target="_blank">Svelte (Framework)</a></h3>
    <h3><a href="https://tablericons.com/" target="_blank">Tabler Icons (Icons)</a></h3>
</TabSlot>