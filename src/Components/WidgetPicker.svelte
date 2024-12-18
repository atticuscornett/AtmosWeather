<script>
    let { addingWidget=$bindable(), widgetRow, widgetLayout = $bindable()} = $props();

    function addWidget(widget){
        widgetLayout[widgetRow].push(widget);
        addingWidget = false;
    }
</script>

<div class="gray-background">
    <div class="popup-container">
        <h1>Widgets</h1>

        <button onclick={addWidget.bind(null, "MultiGraph")}>Multi-graph</button>
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

</style>