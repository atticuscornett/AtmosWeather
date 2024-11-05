<script>
	import AtmosLogo from "./Components/AtmosLogo.svelte";
    import NoticeWindow from "./Components/NoticeWindow.svelte";
    import NavButton from "./Components/NavButton.svelte";
    import MainApp from "./Layout/MainApp.svelte";

    let selected = $state("location");
    let page = $state("about");

    window.goPage = (goTo) => {
        page = goTo;
    }
</script>

<AtmosLogo />
<NoticeWindow />
<div id="app">
    <MainApp bind:page={page} />
    <div id="app-nav">
        <NavButton navName="locations" bind:selected={selected} bind:page={page} />
        <NavButton navName="alerts" bind:selected={selected} bind:page={page} />
        <NavButton navName="radar" bind:selected={selected} bind:page={page} />
        <NavButton navName="settings" bind:selected={selected} bind:page={page}/>
    </div>
</div>

<style>
    #app {
        z-index: 1;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    #app-nav{
        height: 8%;
        width: 100%;
        background-color: white;
        cursor: pointer;
        display: flex;
    }
</style>
