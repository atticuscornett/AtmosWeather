<script>
    let { addingWidget=$bindable(), widgetRow, widgetLayout = $bindable()} = $props();

    function addWidget(e){
        widgetLayout[widgetRow].push(e.target.value);
        addingWidget = false;
        e.stopPropagation();
    }

    function cancel(){
        addingWidget = false;
    }

    function stopPropagation(e){
        e.stopPropagation();
    }
</script>

<div class="gray-background" onclick={cancel}>
    <div class="popup-container">
        <h1>Add Widget</h1>
        <details onclick={stopPropagation}>
            <summary>General</summary>
            <button onclick={addWidget} value="LocationAtAGlance">Location At A Glance</button>
            <button onclick={addWidget} value="LongNWSForecast">NWS Full-text Forecast</button>
        </details>

        <details onclick={stopPropagation}>
            <summary>Advanced</summary>
        </details>

        <details onclick={stopPropagation}>
            <summary>15-minute Forecasts</summary>
        </details>

        <details onclick={stopPropagation}>
            <summary>Graphs</summary>
            <button onclick={addWidget} value="GraphSwitcher">Graph Switcher</button>
        </details>

        <details onclick={stopPropagation}>
            <summary>Air Quality</summary>
            <button onclick={addWidget} value="AirQualityIndex">Air Quality Index</button>
        </details>
    </div>
</div>

<style>
    .gray-background {
        background-color: rgba(0,0,0,0.5);
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 100;
    }

    .popup-container {
        background-color: white;
        width: 80%;
        max-height: 80vh;
        margin: 0 auto;
        padding: 20px;
        border-radius: 10px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    :global(body.dark) .popup-container{
        background-color: #111111;
    }

</style>