<script>
    let getMoonPhaseText = (phase) => {
        if (phase === 0) {
            return "New Moon";
        } else if (phase < 0.25) {
            return "Waxing Crescent";
        } else if (phase === 0.25) {
            return "First Quarter";
        } else if (phase < 0.5) {
            return "Waxing Gibbous";
        } else if (phase === 0.5) {
            return "Full Moon";
        } else if (phase < 0.75) {
            return "Waning Gibbous";
        } else if (phase === 0.75) {
            return "Last Quarter";
        } else {
            return "Waning Crescent";
        }
    }

    let getMoonPhaseEmoji = (phase) => {
        if (phase === 0) {
            return "🌑";
        } else if (phase < 0.25) {
            return "🌒";
        } else if (phase === 0.25) {
            return "🌓";
        } else if (phase < 0.5) {
            return "🌔";
        } else if (phase === 0.5) {
            return "🌕";
        } else if (phase < 0.75) {
            return "🌖";
        } else if (phase === 0.75) {
            return "🌗";
        } else {
            return "🌘";
        }
    }

    let getMoonBrightnessStage = (illumination) => {
        if (illumination < 0.3){
            return "dark";
        } else if (illumination < 0.6) {
            return "medium";
        }
        return "bright";
    }
</script>

<div class={getMoonBrightnessStage(SunCalc.getMoonIllumination().fraction)}>
    <h3>Moon Phase</h3>
    <h1>{getMoonPhaseEmoji(SunCalc.getMoonIllumination().phase)}</h1>
    <h4>{getMoonPhaseText(SunCalc.getMoonIllumination().phase)}</h4>
    <h4>{Math.round(SunCalc.getMoonIllumination().fraction * 100)}% illuminated</h4>
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

    h1 {
        font-size: 5em;
        margin: 0;
    }

    h3, h4 {
        margin: 0;
    }

    .dark {
        background: #051726;
        background: linear-gradient(130deg, rgba(5, 23, 38, 0.95) 0%, rgba(44, 62, 102, 1) 100%);
    }

    .medium {
        background: #2c3e66;
        background: linear-gradient(130deg, rgba(44, 62, 102, 0.95) 0%, rgba(59, 88, 163, 1) 100%);
    }

    .bright {
        background: #3b58a3;
        background: linear-gradient(130deg, rgba(59, 88, 163, 0.95) 0%, rgba(85, 116, 194, 1) 100%);
    }


</style>