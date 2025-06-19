<script>
    import LocationAtAGlance from "./LocationWidgets/LocationAtAGlance.svelte";
    import AirQualityIndex from "./LocationWidgets/AirQualityIndex.svelte";
    import GraphSwitcher from "./LocationWidgets/GraphSwitcher.svelte";
    import LongNWSForecast from "./LocationWidgets/LongNWSForecast.svelte";
    import WidgetPicker from "./WidgetPicker.svelte";
    import CapeGraph from "./Graphs/CapeGraph.svelte";
    import Next15Minutes from "./LocationWidgets/Next15Minutes.svelte";
    import SunriseSunset from "./LocationWidgets/SunriseSunset.svelte";
    import AQIBreakdown from "./LocationWidgets/AQIBreakdown.svelte";
    import WeekAtAGlance from "./LocationWidgets/WeekAtAGlance.svelte";
    import AllPollutants from "./LocationWidgets/AllPollutants.svelte";
    import TemperatureGraph from "./Graphs/TemperatureGraph.svelte";
    import PrecipitationGraph from "./Graphs/PrecipitationGraph.svelte";
    import WindGraph from "./Graphs/WindGraph.svelte";
    import HumidityGraph from "./Graphs/HumidityGraph.svelte";
    import DewpointGraph from "./Graphs/DewpointGraph.svelte";
    import FeelsLikeGraph from "./Graphs/FeelsLikeGraph.svelte";
    import AQINext3Days from "./LocationWidgets/AQINext3Days.svelte";
    import UVIndex from "./LocationWidgets/UVIndex.svelte";
    import RadarGlance from "./LocationWidgets/RadarGlance.svelte";
    import MoonPhase from "./LocationWidgets/MoonPhase.svelte";

    let { locationData, widgets, editing, rowIndex, widgetLayout=$bindable(), page=$bindable() } = $props();

    let addingWidget = $state(false);

    function removeWidgetRow(){
        widgetLayout.splice(rowIndex, 1);
    }
</script>

{#if widgets.length !== 1 || !widgets[0].includes("Template:")}
    <div class="widgetRow">
        {#each widgets as widget}
            <div class="widgetContainer">
                {#if widget === "LocationAtAGlance"}
                    <LocationAtAGlance locationData={locationData} bind:page={page} />
                {/if}
                {#if widget === "AirQualityIndex"}
                    <AirQualityIndex locationData={locationData} />
                {/if}
                {#if widget === "GraphSwitcher"}
                    <GraphSwitcher locationData={locationData} />
                {/if}
                {#if widget === "LongNWSForecast"}
                    <LongNWSForecast locationData={locationData} />
                {/if}
                {#if widget === "CAPEGraph"}
                    <CapeGraph locationData={locationData} uniqueName="CAPE-{locationData.name}"/>
                {/if}
                {#if widget === "Next15Minutes"}
                    <Next15Minutes locationData={locationData} />
                {/if}
                {#if widget === "SunriseSunset"}
                    <SunriseSunset locationData={locationData} />
                {/if}
                {#if widget === "AQIBreakdown"}
                    <AQIBreakdown locationData={locationData} />
                {/if}
                {#if widget === "WeekAtAGlance"}
                    <WeekAtAGlance locationData={locationData} />
                {/if}
                {#if widget === "AllPollutants"}
                    <AllPollutants locationData={locationData} />
                {/if}
                {#if widget === "TemperatureGraph"}
                    <h2>Temperature Forecast</h2>
                    <TemperatureGraph uniqueName="graphWidget" locationData={locationData} />
                {/if}
                {#if widget === "PrecipitationGraph"}
                    <h2>Precipitation Forecast</h2>
                    <PrecipitationGraph uniqueName="graphWidget" locationData={locationData} />
                {/if}
                {#if widget === "WindGraph"}
                    <h2>Wind Forecast</h2>
                    <WindGraph uniqueName="graphWidget" locationData={locationData} />
                {/if}
                {#if widget === "HumidityGraph"}
                    <h2>Humidity Forecast</h2>
                    <HumidityGraph uniqueName="graphWidget" locationData={locationData} />
                {/if}
                {#if widget === "DewpointGraph"}
                    <h2>Dew Point Forecast</h2>
                    <DewpointGraph uniqueName="graphWidget" locationData={locationData} />
                {/if}
                {#if widget === "FeelsLikeGraph"}
                    <h2>Feels Like Forecast</h2>
                    <FeelsLikeGraph uniqueName="graphWidget" locationData={locationData} />
                {/if}
                {#if widget === "AQINext3Days"}
                    <AQINext3Days locationData={locationData} />
                {/if}
                {#if widget === "UVIndex"}
                    <UVIndex locationData={locationData} />
                {/if}
                {#if widget === "RadarGlance"}
                    <RadarGlance locationData={locationData} bind:page={page}/>
                {/if}
                {#if widget === "MoonPhase"}
                    <MoonPhase/>
                {/if}
            </div>
        {/each}
        {#if editing}
            <button class="editButton" onclick={()=>{addingWidget=true;}}>Add Widget</button>
            <button class="editButton" onclick={removeWidgetRow}>Remove Row</button>
        {/if}
        {#if addingWidget}
            <WidgetPicker bind:addingWidget={addingWidget} widgetRow={rowIndex} bind:widgetLayout={widgetLayout} bind:locationData={locationData} />
        {/if}
    </div>
{/if}

<style>
    .widgetRow {
        display: flex;
        overflow: auto;
        margin-bottom: 10px;
    }

    .widgetContainer {
        flex: 10;
        margin-right: 10px;
    }

    .editButton {
        margin-bottom: 10px;
        flex: 0.5;
        min-width: auto;
        background-color: darkslategray;
        border: white dashed 5px;
        margin-right: 10px;
        border-radius: 7px;
        color: white;
        font-weight: bold;
        min-height: 75px;
        cursor: pointer;

    }
</style>