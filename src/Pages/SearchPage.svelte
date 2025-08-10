<script>
    import TabSlot from "../Layout/TabSlot.svelte";

    let { page = $bindable() } = $props();
    let searchQuery = $state("");
    let searchResults = $state([]);
    let searchNames = $state([]);
    let searchStatus = $state("idle");
    let filteredResults = $state([]);

    function locationSearch(){
        // Format query to standard
        let query = searchQuery;
        query = query.replace(/,/g, " ")
        query = query.replace(/ {2}/g, " ");
        query = query.replace(/ {2}/g, " ");
        query = query.toLowerCase();
        let searchCache = JSON.parse(window.localStorage.getItem("nominatim-storage"));

        if (searchCache.hasOwnProperty(query) && searchCache[query].length > 0){
            console.log("Using cached results for: " + query);
            searchResults = searchCache[query];
            filteredResults = [];
            for (let  i = 0; i < searchResults.length; i++){
                if (searchResults[i]["display_name"].includes("United States")
                    && !filteredResults.includes(searchResults[i])){
                    filteredResults.push(searchResults[i])
                }
            }
            searchNames = nomItemsToNames(filteredResults);
            searchStatus = "loaded";
        }
        else{
            searchStatus = "loading";
            console.log("Searching for: " + query);
            JSONGetAsync('https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(query) + "&format=json",
                (jsonResults) => {
                    searchResults = jsonResults;
                    searchCache[query] = searchResults;
                    window.localStorage.setItem("nominatim-storage", JSON.stringify(searchCache));

                    console.log(jsonResults);
                    // Filter results to prevent duplicates and only allow US locations
                    filteredResults = [];
                    for (let  i = 0; i < searchResults.length; i++){
                        if (searchResults[i]["display_name"].includes("United States")
                            && !filteredResults.includes(searchResults[i])){
                            filteredResults.push(searchResults[i])
                        }
                    }
                    searchNames = nomItemsToNames(filteredResults);

                    searchStatus = "loaded";
                });
        }

    }


    function handleEnter(event) {
        if (event.key === "Enter") {
            locationSearch();
        }
    }

    function selectResult(id){
        console.log("Selected: " + id);
        console.log(filteredResults[id]);
        console.log(filteredResults);
        let name = searchNames[id];
        let searchOutput = filteredResults[id];
        let weatherLocations = JSON.parse(localStorage.getItem("weather-locations"));
        let weatherLocationNames = JSON.parse(localStorage.getItem("weather-location-names"));
        if (!weatherLocationNames.includes(name)){
            weatherLocations.push(searchOutput);
            weatherLocationNames.push(name)
            localStorage.setItem("weather-locations", JSON.stringify(weatherLocations));
            localStorage.setItem("weather-location-names", JSON.stringify(weatherLocationNames));
        }
        page = "locations";
        syncFiles();
    }
</script>

<TabSlot name="search" bind:page={page}>
    <h1>Location Search</h1>
    <h6>Enter a city name or a zip code.</h6>
    <input id="location-search" bind:value={searchQuery} onkeydown={handleEnter}>
    <img alt="Search Icon" id="search-button" src="img/search.svg"  onclick={locationSearch}>
    <h6>Powered by the <a href="https://nominatim.org/" target="_blank">Nominatim API</a></h6>
    <br><br><br>
    <div id="search-results">
        {#each searchNames as name, i}
            <div class="searchResult" onclick={() => selectResult(i)}>
                <img alt="Location Pin" class="locationIcon" src="img/location-pin.svg">
                <h1 class="resultTitle">{name}</h1>
            </div>
            <br>
        {/each}

        {#if searchStatus === "loaded" && searchNames.length === 0}
            <h1>Couldn't find that location!</h1>
        {/if}
    </div>
</TabSlot>

<style>
    #search-button {
        vertical-align: bottom;
        cursor: pointer;
    }

    .locationIcon {
        float:left;
        vertical-align: text-bottom;
        width: 35px;
        margin-left: 10px;
    }

    .resultTitle {
        margin-left: 40px;
    }

    .searchResult{
        display: flex;
        align-items: center;
        background-color: dodgerblue;
        color: white;
        border: none;
        border-radius: 7px;
        padding: 20px 0;
        cursor: pointer;
    }

    #location-search {
        font-size: 30px;
        width: 50%;
    }
</style>