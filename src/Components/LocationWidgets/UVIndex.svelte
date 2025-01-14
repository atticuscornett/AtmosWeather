<script>
    let { locationData } = $props();

    let UVIndex = $state("Loading...");
    let UVIndexClear = $state("Loading...");
    let UVIndexMax24 = $state("Loading...");

    let getUVIndex = () => {
        console.log(locationData.openMeteoData)

        if (!locationData.openMeteoData){
            setTimeout(getUVIndex, 1000);
            return;
        }

        if (!locationData.openMeteoData["hourly"]["uv_index"]){
            setTimeout(getUVIndex, 1000);
            return;
        }

        let UVIndexData = removeOldData(locationData.openMeteoData["hourly"]["time"], locationData.openMeteoData["hourly"]["uv_index"]);

        UVIndex = UVIndexData[1][0];
        UVIndexClear = removeOldData(locationData.openMeteoData["hourly"]["time"], locationData.openMeteoData["hourly"]["uv_index_clear_sky"])[1][0];

        UVIndexMax24 = UVIndex;
        for (let i = 1; i < 24; i++){
            if (UVIndexData[1][i] > UVIndexMax24){
                UVIndexMax24 = UVIndexData[1][i];
            }
        }

    }

    getUVIndex();
</script>

<div>
    <img src="img/uv-index.svg" alt="UV Index Icon" width="75">
    <h3>UV Index: {UVIndex}</h3>
    <h3>UV Index (Clear Sky): {UVIndexClear}</h3>
    <h3>Max UV Index (24 Hours): {UVIndexMax24}</h3>
</div>

<style>
    div {
        background: #555;
        border-radius: 7px;
        margin-bottom: 15px;
        height: 100%;
        color: white;
        text-align: center;
        padding-top: 15px;
        padding-bottom: 15px;
    }
</style>