<script>
    let { locationData, page=$bindable() } = $props();

    let status = $derived(locationData.fullStatus[0])
    let alerts = $derived(locationData.alerts)

    // Weather Alert Bar
    // var theWarnings = "";
    // var b = 0;
    // while (b < activeAlertInfo.length){
    //     theWarnings += "&emsp;"
    //     b++;
    // }
    //
    // if (fullStatus[0] == "warning"){
    // }
    // if (fullStatus[0] == "watch"){
    //     generatedCode += '<div class="location ' + fullStatus[0] + '"><div style="display: inline-block;height: inherit;vertical-align: top;margin-top:20px;"><img style="vertical-align:center;" src="img/watch.svg"></div><div style="display:inline-block;margin-left:8px;margin-right: 8px;"><h1>This location has active watches.</h1><h3 style="margin-right:8px;">' + theWarnings + ' (Tap for more.)</h3></div></div><br>';
    // }
    // if (fullStatus[0] == "other"){
    //     theWarnings = theWarnings.replaceAll(",", ", ")
    //     generatedCode += '<div class="location ' + fullStatus[0] + '"><div style="display: inline-block;height: inherit;vertical-align: top;margin-top:20px;"><img style="vertical-align:center;" src="img/watch.svg"></div><div style="display:inline-block;margin-left:8px;margin-right: 8px;"><h1>This location has active weather statements.</h1><h3 style="margin-right:8px;">' + theWarnings + ' (Tap for more.)</h3></div></div><br>';
    // }
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
                    <a href='#' onclick={()=>{page = "alert-"+ locationData.name + "-" + i}}>
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
    }
</style>