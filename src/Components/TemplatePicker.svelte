<script>
    let { addingTemplate=$bindable(), locationData=$bindable(), widgets = $bindable(),
        widgetLayout, refreshWidgets, toggleEdit} = $props();

    function selectTemplate(e){
        widgets[locationData.name] = ["Template:" + e.target.value];
        localStorage.setItem("widgets", JSON.stringify(widgets));

        addingTemplate = false;
        e.stopPropagation();
        refreshWidgets();
        toggleEdit();

        setTimeout(() => {
            getAdditionalWeatherDataForNomAsync(locationData.nominatim, (additionalData)=>{
                locationData.openMeteoData = additionalData;
            }, widgetLayout)
        }, 100);
    }



    function cancel(){
        addingTemplate = false;
    }

    function stopPropagation(e){
        e.stopPropagation();
    }
</script>

<div class="gray-background" onclick={cancel}>
    <div class="popup-container" onclick={stopPropagation}>
        <h1>Use Template</h1>

        <button onclick={selectTemplate} value="default">Default Template</button>
        <button onclick={selectTemplate} value="dense">Dense Tiles</button>
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
        z-index: 1999;
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
        overflow: auto;
    }

    :global(body.dark) .popup-container{
        background-color: #111111;
    }

    button {
        width: 100%;
        cursor: pointer;
        background-color: darkslategray;
        color: white;
        border: none;
        border-radius: 7px;
        font-size: 20px;
        font-family: Secular One, sans-serif;
        margin-top: 7px;
        margin-bottom: 7px;
    }

</style>