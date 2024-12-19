<script>
    let { locationData, page=$bindable(), alertSelection=$bindable() } = $props();

    let status = $derived(locationData.alert);
    let alerts = $derived(locationData.alerts);
</script>

{#if status !== "noalerts"}
    <div class="location {status}">
        <div class="imgContainer">
            <img src="img/{status === 'warning' ? 'warning' : 'watch'}.svg" alt="Alert Symbol">
        </div>
        <div class="alertContainer">
            {#if status === "warning"}
                <h1>This location has active warnings!</h1>
            {/if}
            {#if status === "watch"}
                <h1>This location has active watches.</h1>
            {/if}
            {#if status === "other"}
                <h1>This location has active weather statements.</h1>
            {/if}

            <h3>
                {#each alerts as alert, i}
                    <a href='#' onclick={()=>{
                        page = "alert-view";
                        alertSelection={name: locationData.name, id: i};
                    }}>
                        {alert["properties"]["event"]}
                    </a>
                    &emsp;
                {/each}
                (Tap for more.)</h3>
        </div>
    </div>
    <br>
{/if}

<style>
    .imgContainer {
        display: inline-block;
        height: inherit;
        vertical-align: top;
        margin-top:20px;
    }

    .alertContainer {
        display:inline-block;
        margin-left:8px;
        margin-right: 8px;
    }

    img {
        vertical-align:center;
    }

    h3 {
        margin-right:8px;
    }

    a {
        color: white;
    }

    .location{
        background-color: blue;
        color: white;
        border-radius: 7px;
        padding-top: 1px;
        padding-bottom: 1px;
        padding-left: 20px;
        -webkit-box-sizing: border-box;
        -mox-box-sizing: border-box;
        box-sizing: border-box;
        cursor: pointer;
        box-shadow: 0 0 7px #898989;
        margin-right: 10px;
    }
</style>