# Themes

Themes allow you to customize the look and feel of Atmos Weather.
The theme system is available in version 3.1.0 and later.
Atmos Weather includes several built-in themes that you can choose from, and you can also create your own custom themes.

## Creating a Custom Theme
**Note about custom themes:**
While every effort is made to ensure themes cannot be used to execute malicious code,
you should still be cautious when downloading and using themes from untrusted sources, as they could potentially contain harmful CSS.

***A standalone theme editor is planned for the future, but you can create custom themes now manually using the steps below.***

Although the built-in themes are stored as CSS files, custom themes are created using JSON files.
The JSON object should be a dictionary where the keys are CSS variable names (without the `--` prefix)
and the values are the corresponding CSS values, both as strings.

Themes should define the `"fallback-theme"` value as `"black"` or `"white"` (corresponding to dark mode and light mode,
respectively) to specify which built-in theme to use as a base for any variables that are not defined in the custom theme.

For example, this (very ugly) theme turns most of the UI red:

```json
{
    "fallback-theme": "black",
    "background-start": "hsla(50, 50%, 50%, 0.5)",
    "background-end": "red",
    "secondary-text-color": "red",
    "positive-button": "red",
    "add-location-button": "red",
    "no-alerts-background": "red",
    "box-shadow-color": "red",
    "input-accent": "red",
    "nav-button-background": "red",
    "nav-button-selected": "red",
    "loading-dots-color": "red",
    "editor-background": "red",
    "polutant-background-color": "red",
    "sunrise-sunset-background-color": "red",
    "nav-icon-color": "white"
}
```
As shown in the example above, the values can be color names, hex codes, or any other valid CSS values that only use
supported characters.
The variable names must be on the allow list of CSS variables that Atmos Weather uses for theming. 
Note that only a limited set of characters are supported in theme values, so some CSS values may not work correctly.
Supported characters include letters, numbers, spaces, and the following symbols: `#()%,.-`.
This means you cannot use transparency using `rgb` or `hsl` color formats, but you can use `hsla` and `rgba` instead.

If a value contains unsupported characters or the variable name is not on the allow list, the app will refuse to load the theme.

A full list of the available CSS variables that can be defined in themes can be found in the 
[light theme](https://github.com/atticuscornett/AtmosWeather/blob/main/www/css/themes/light-theme.css)
or [dark theme](https://github.com/atticuscornett/AtmosWeather/blob/main/www/css/themes/dark-theme.css).