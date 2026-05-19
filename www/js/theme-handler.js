let allowedProperties = [
    "fallback-theme",
    "background-start", "background-end", "background-angle", "primary-text-color",
    "secondary-text-color", "accordian-border-color", "accordian-shadow-color",
    "input-accent", "loading-dots-color", "add-location-button", "add-location-button-text",
    "box-shadow-color", "positive-button", "positive-button-text", "negative-button",
    "negative-button-text", "nav-button-background", "nav-button-selected",
    "editor-background", "editor-text-color", "default-background", "error-background",
    "current-location-background", "location-text-color", "no-alerts-background",
    "no-alerts-text-color", "watch-background", "watch-background-secondary",
    "watch-text-color", "warning-background", "warning-background-secondary",
    "warning-text-color", "statement-background", "statement-background-secondary",
    "statement-text-color", "polutant-background-color", "polutant-text-color",
    "sunrise-sunset-background-color", "sunrise-sunset-text-color",
    "graph-text-color", "cape-graph-start", "cape-graph-end", "humidity-graph-start",
    "humidity-graph-end", "wind-graph-start", "wind-graph-end", "precipitation-graph-start",
    "precipitation-graph-2", "precipitation-graph-end", "temp-graph-start", "temp-graph-2",
    "temp-graph-3", "temp-graph-4", "temp-graph-end", "graph-icon-color", "nav-icon-color"
];

function importTheme(theme){
    let themeData = JSON.parse(theme);

    if (Object.keys(themeData).length === 0){
        console.log("Malformed theme: Not a dictionary");
        return false;
    }

    for (let key in themeData){
        if (!allowedProperties.includes(key)){
            console.log(`Malformed theme: Property ${key} is not allowed`);
            return false;
        }

        if (typeof themeData[key] !== "string"){
            console.log(`Malformed theme: Invalid data for property ${key} (Type fail)`);
            return false;
        }

        if (!(/^[A-Za-z0-9(), \-#]*$/.test(themeData[key]))) {
            console.log(`Malformed theme: Invalid data for property ${key} (Invalid character)`);
            return false;
        }
    }

    // Theme is (probably) safe and valid

    // Load variables for key
    for (let key in themeData){
        document.documentElement.style.setProperty('--' + key, themeData[key]);
    }

    return true;
}