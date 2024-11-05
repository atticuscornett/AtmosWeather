<script>
	import AtmosLogo from "./Components/AtmosLogo.svelte";
    import NoticeWindow from "./Components/NoticeWindow.svelte";
    import NavButton from "./Components/NavButton.svelte";

    let selected = $state("location");
</script>

<AtmosLogo />
<NoticeWindow />

<div id="app">
    <div id="app-nav">
        <NavButton navName="location" bind:selected={selected} />
        <NavButton navName="alerts" bind:selected={selected} />
        <NavButton navName="radar" bind:selected={selected} />
        <NavButton navName="settings" bind:selected={selected} />
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

    :global(body.dark) #app-nav{
        background-color: hsla(0,0%,15%,1.00);
    }

    :global(body.dark) {
        background-color: #222222;
        color: white;
    }

    :global(h1){
            font-family: Secular One, sans-serif;
    }

    :global(h2, h3, h4, h5, h6){
        font-family: Lexend Deca, sans-serif;
    }
</style>
