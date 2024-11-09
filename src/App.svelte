<script>
	import AtmosLogo from "./Components/AtmosLogo.svelte";
    import NoticeWindow from "./Components/NoticeWindow.svelte";
    import NavButton from "./Components/NavButton.svelte";
    import MainApp from "./Layout/MainApp.svelte";

    let selected = $state("locations");
    let page = $state("locations");

    window.goPage = (goTo) => {
        page = goTo;
    }

    window.refreshAppTheme = () => {
        window.appTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        let currentSettings = JSON.parse(localStorage.getItem("atmos-settings"));
        if (currentSettings["personalization"]){
            if (currentSettings["personalization"]["theme"] !== "system"){
                window.appTheme = currentSettings["personalization"]["theme"];
            }
        }
        document.body.setAttribute("class", window.appTheme);
    }
    setTimeout(refreshAppTheme, 100);
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

    :global(body.dark) #app-nav{
         background-color: hsla(0,0%,15%,1.00);
     }
</style>
