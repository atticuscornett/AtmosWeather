<script>
    import AboutPage from "../Pages/AboutPage.svelte";
    import PrivacyPage from "../Pages/PrivacyPage.svelte";

    let { page = $bindable() } = $props();
</script>

<div id="main-app">
    <br>
    <AboutPage bind:page={page}/>
    <PrivacyPage bind:page={page}/>
</div>

<style>
    #main-app{
        height: 92%;
        width: 100%;
        padding: 0;
        overflow-x: hidden;
    }
</style>