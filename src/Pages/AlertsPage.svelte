<script>
    import TabSlot from "../Layout/TabSlot.svelte";

    let { page = $bindable() } = $props();

    let currentAlerts = $state([]);
    let oldAlerts = $state([]);
    let nonNullLength = $state(0);

    // Checks if the alerts are old and moves them to the old alerts list
    function refreshAlerts(){
        checkIfOldAlerts(true, ()=>{
            currentAlerts = JSON.parse(localStorage.getItem("nws-alerts-current"));
            oldAlerts = JSON.parse(localStorage.getItem("nws-alerts-old"));
            nonNullLength = 0;

            for (let i = 0; i < currentAlerts.length; i++){
                if (currentAlerts[i] != null){
                    nonNullLength += 1;
                }
            }
        });
    }
</script>

<TabSlot name="alerts" bind:page={page} onOpen={refreshAlerts}>
    <h1>Alerts</h1>
    <br>

    <div id="alerts-main">
        <h2>Currently Active</h2>
        <hr>
        <div id="active-alert-list">
            <!-- Loops through the current alerts and displays them -->
            {#each currentAlerts as alert}
                {#if alert !== null}
                    <h2>{alert["properties"]["event"]}</h2>
                    <h4>{alert["properties"]["headline"]}</h4>
                    <h4>{alert["properties"]["areaDesc"]}</h4>

                    {#if alert["properties"]["instruction"]}
                        <h4>{alert["properties"]["instruction"]}</h4>
                    {/if}
                    <br>
                {/if}
            {/each}

            {#if nonNullLength === 0}
                <h2>There are currently no active alerts for your locations.</h2>
            {/if}
        </div>
        <br>
        <h2>Previously Received</h2>
        <hr>
        <div id="old-alert-list">
            <!-- Loops through the old alerts and displays them -->
            {#each oldAlerts.slice().reverse() as alert}
                <h2>{alert["properties"]["event"]}</h2>
                <h4>{alert["properties"]["headline"]}</h4>
                <h4>{alert["properties"]["areaDesc"]}</h4>
                <br>
            {/each}

            {#if oldAlerts.length === 0}
                <h2>You have no previously received alerts.</h2>
            {/if}
            <br>
        </div>
    </div>
    <br>
</TabSlot>