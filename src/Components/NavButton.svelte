<script>
    let { navName, selected = $bindable() } = $props();
</script>

<div id="{navName}-nav" class={selected === navName ? "selected-nav" : ""} onclick={selected=navName}>
    <img src="img/{navName}.svg" class="nav-icon" alt={navName}>
</div>

<style>
    div {
        text-align: center;
        width: 100%;
    }

    .nav-icon{
        height: 4vh;
        margin-top: 2vh;
        cursor: pointer;
    }

    .selected-nav {
        background-color: #EEEEEE;
        border-radius: 7px;
    }

    :global(body.dark) .selected-nav{
        background-color: #111111;
        border-radius: 7px;
    }
</style>