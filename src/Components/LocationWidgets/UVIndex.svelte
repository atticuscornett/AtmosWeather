<script>
    let { locationData } = $props();

    let UVIndex = $state("Loading...");
    let UVIndexClear = $state("Loading...");
    let UVIndexMax24 = $state("Loading...");

    let getUVIndex = () => {
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

    let getUVIndexText = (value) => {
        // Generate text description according to https://www.epa.gov/sites/default/files/documents/uviguide.pdf
        if (value === "Loading...") return "Loading...";

        if (value < 3) return "Low";
        if (value < 6) return "Moderate";
        if (value < 8) return "High";
        if (value < 11) return "Very High";
        return "Extreme";
    }

    getUVIndex();
</script>

<div class={getUVIndexText(UVIndex).toLocaleLowerCase()}>
    <img src="img/uv-index.svg" alt="UV Index Icon" width="75">
    <h3>UV Index: {UVIndex} ({getUVIndexText(UVIndex)})</h3>
    <h3>UV Index (Clear Sky): {UVIndexClear} ({getUVIndexText(UVIndexClear)})</h3>
    <h3>Max UV Index (24 Hours): {UVIndexMax24} ({getUVIndexText(UVIndexMax24)})</h3>
</div>

<style>
    div {
        background: #555;
        border-radius: 7px;
        color: white;
        text-align: center;
        padding-top: 15px;
        padding-bottom: 15px;
        height: calc(100% - 30px);
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 15px;
        flex-direction: column;
    }

    h3 {
        margin-bottom: 2px;
        margin-top: 2px;
    }

    .low {
        background: #3ec770;
        background: linear-gradient(143deg, rgba(62, 199, 112, 1) 0%, rgba(0, 181, 66, 1) 100%);
    }

    .moderate {
        background: #f0c330;
        background: linear-gradient(143deg, rgba(240, 195, 48, 1) 0%, rgba(255, 170, 0, 1) 100%);
    }

    .high {
        background: #f08c30;
        background: linear-gradient(143deg, rgba(240, 140, 48, 1) 0%, rgba(255, 100, 0, 1) 100%);
    }

    .very-high {
        background: #f03030;
        background: linear-gradient(143deg, rgba(240, 48, 48, 1) 0%, rgba(255, 0, 0, 1) 100%);
    }

    .extreme {
        background: #f03030;
        background: linear-gradient(143deg, rgba(240, 48, 48, 1) 0%, rgba(255, 0, 0, 1) 100%);
    }
</style>