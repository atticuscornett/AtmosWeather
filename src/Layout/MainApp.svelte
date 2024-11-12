<script>
    import AboutPage from "../Pages/AboutPage.svelte";
    import PrivacyPage from "../Pages/PrivacyPage.svelte";
    import SettingsPage from "../Pages/SettingsPage.svelte";
    import LocationsPage from "../Pages/LocationsPage.svelte";
    import SearchPage from "../Pages/SearchPage.svelte";
    import LocationWeatherPage from "../Pages/LocationWeatherPage.svelte";
    import LocationAlertPage from "../Pages/LocationAlertPage.svelte";
    import AlertsPage from "../Pages/AlertsPage.svelte";

    let { page = $bindable() } = $props();
    let weatherDataDictionary = $state({});
    let alertSelection = $state({});

    $inspect(weatherDataDictionary);
</script>

<div id="main-app">
    <br>
    <AboutPage bind:page={page}/>
    <LocationsPage bind:page={page} bind:weatherDataDictionary={weatherDataDictionary} />
    <PrivacyPage bind:page={page}/>
    <SettingsPage bind:page={page}/>
    <SearchPage bind:page={page}/>
    <AlertsPage bind:page={page}/>

    {#if alertSelection.name}
    <LocationAlertPage bind:page={page} locationData={weatherDataDictionary[alertSelection.name]}
                       alertID={alertSelection.id}/>
    {/if}

    {#each Object.entries(weatherDataDictionary) as [key, value]}
        <LocationWeatherPage locationData={value} bind:page={page} bind:alertSelection={alertSelection}/>
    {/each}
</div>

<style>
    #main-app{
        height: 92%;
        width: 100%;
        padding: 0;
        overflow-x: hidden;
    }
</style>