<script>
    let { locationData } = $props();
</script>

<h1>NWS Forecast</h1>

{#if locationData.forecast}
    {#each locationData.forecast[0] as i}
        <details>
            <summary>{i["name"]}</summary>
            {i["detailedForecast"]}
        </details>
    {/each}
{:else}
    <h2>Loading NWS forecasts...</h2>
{/if}