package io.atticusc.atmosweather;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Locale;
import java.util.concurrent.ThreadLocalRandom;

import io.atticusc.atmosweather.notifications.AtmosNotification;
import io.atticusc.atmosweather.notifications.AtmosNotificationBuilder;
import io.atticusc.atmosweather.notifications.NotificationHandler;

public class InformWeather {
    public static Boolean InformWeatherReturn(String eventTitle, String locationName, String eventInfo, Context context){
        if (eventTitle.contains("Red Flag Warning")){
            eventTitle = "Fire Weather Warning";
        }
        SharedPreferences settings = context.getSharedPreferences("NativeStorage", Context.MODE_MULTI_PROCESS);
        String defaultSettings = "{\"location\":{\"weather\":true,\"alerts\":true},\"notifications\":{\"severe-future\":true,\"rain-future\":false},\"location-alerts\":{\"default-alert\":\"readynow\",\"default-notification\":\"readynow\",\"locations\":{}},\"alert-types\":{\"warnings\":{\"tornado\":\"alert\",\"hurricane\":\"alert\",\"hurricane-force-wind\":\"alert\",\"tropical-storm\":\"alert\",\"special-marine\":\"alert\",\"severe-thunderstorm\":\"alert\",\"storm\":\"alert\",\"gale\":\"alert\",\"flash-flood\":\"alertmove\",\"flood\":\"alertmove\",\"coastal-flood\":\"alertmove\",\"river-flood\":\"alertmove\",\"high-wind\":\"soundnotification\",\"extreme-wind\":\"alert\",\"excessive-heat\":\"soundnotification\",\"fire-weather\":\"alert\",\"blizzard\":\"alert\",\"snow-squall\":\"alertmove\",\"ice-storm\":\"alert\",\"winter-storm\":\"alert\",\"freeze\":\"soundnotification\",\"wind-chill\":\"soundnotification\"},\"watches\":{\"tornado\":\"soundnotification\",\"hurricane\":\"soundnotification\",\"tropical-storm\":\"soundnotification\",\"severe-thunderstorm\":\"soundnotification\",\"flash-flood\":\"soundnotification\",\"flood\":\"soundnotification\",\"coastal-flood\":\"soundnotification\",\"river-flood\":\"soundnotification\",\"high-wind\":\"soundnotification\",\"excessive-heat\":\"soundnotification\",\"fire-weather\":\"soundnotification\",\"winter-storm\":\"soundnotification\",\"freeze\":\"soundnotification\"},\"advisory\":{\"wind\":\"soundnotification\",\"winter-weather\":\"soundnotification\",\"frost\":\"soundnotification\",\"wind-chill\":\"soundnotification\",\"heat\":\"soundnotification\",\"dense-fog\":\"soundnotification\",\"small-craft\":\"soundnotification\",\"coastal-flood\":\"soundnotification\"}},\"per-location\":{}}";
        JSONObject jsonObject = null;
        boolean doTTS = false;
        String alertSound = "readynow";
        String notificationSound = "readynow";
        try {
            jsonObject = new JSONObject(settings.getString("settings", defaultSettings));
            alertSound = jsonObject.getJSONObject("location-alerts").getString("default-alert");
            notificationSound = jsonObject.getJSONObject("location-alerts").getString("default-notification");
            doTTS = jsonObject.getJSONObject("location-alerts").getBoolean("tts-alerts");
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        try {
            jsonObject = new JSONObject(settings.getString("settings", defaultSettings));
            alertSound = jsonObject.getJSONObject("per-location").getJSONObject(locationName).getJSONObject("location-alerts").getString("default-alert");
        }
        catch (JSONException e) {
            System.out.println("Using default alert sound");
        }
        try{
            notificationSound = jsonObject.getJSONObject("per-location").getJSONObject(locationName).getJSONObject("location-alerts").getString("default-notification");
        }
        catch (Exception e){
            System.out.println("Using default notification sound");
        }
        try{
            doTTS = jsonObject.getJSONObject("per-location").getJSONObject(locationName).getJSONObject("location-alerts").getBoolean("tts-alerts");
        }
        catch (Exception e){
            System.out.println("Using default tts setting");
        }
        String jsonKey = eventTitle.toLowerCase(Locale.ROOT).replaceAll(" ", "-");
        switch (jsonKey) {
            case "air-quality-alert":
                jsonKey = "air-quality-warning";
                break;
            case "hazardous-weather-outlook":
                jsonKey = "hazardous-weather-outlook-advisory";
                break;
            case "hydrologic-outlook":
                jsonKey = "hydrologic-outlook-advisory";
                break;
            case "special-weather-statement":
                jsonKey = "special-weather-statement-advisory";
                break;
            case "marine-weather-statement":
                jsonKey = "marine-weather-statement-advisory";
                break;
            case "coastal-flood-statement":
                jsonKey = "coastal-flood-advisory";
                break;
            case "rip-current-statement":
                jsonKey = "rip-current-statement-advisory";
                break;
            case "beach-hazards-statement":
                jsonKey = "beach-hazards-statement-advisory";
                break;
            case "severe-weather-statement":
                jsonKey = "severe-weather-statement-advisory";
                break;
            case "hurricane-local-statement":
                jsonKey = "hurricane-local-statement-advisory";
                break;
            case "tropical-cyclone-statement":
                jsonKey = "tropical-cyclone-statement-advisory";
                break;
            default:
                break;
        }
        String behavior = "soundnotification";
        int iconID = R.drawable.lightning_icon;
        try {
            if (jsonKey.contains("warning")){
                iconID = R.drawable.warning_icon;
                jsonKey = jsonKey.replace("-warning", "");
                behavior = jsonObject.getJSONObject("alert-types").getJSONObject("warnings").getString(jsonKey);
            }
            else if (jsonKey.contains("watch")){
                iconID = R.drawable.watch_icon;
                jsonKey = jsonKey.replace("-warning", "");
                behavior = jsonObject.getJSONObject("alert-types").getJSONObject("watches").getString(jsonKey);
            }
            else{
                jsonKey = jsonKey.replace("-advisory", "");
                behavior = jsonObject.getJSONObject("alert-types").getJSONObject("advisory").getString(jsonKey);
            }
        }
        catch (Exception e){
            System.out.println(jsonKey);
            System.out.println(behavior);
            System.out.println("Hmm... something went wrong parsing json.");
        }
        jsonKey = eventTitle.toLowerCase(Locale.ROOT).replaceAll(" ", "-");
        try {
            if (jsonKey.contains("warning")){
                jsonKey = jsonKey.replace("-warning", "");
                behavior = jsonObject.getJSONObject("per-location").getJSONObject(locationName).getJSONObject("alert-types").getJSONObject("warnings").getString(jsonKey);
            } else if (jsonKey.contains("watch")) {
                jsonKey = jsonKey.replace("-watch", "");
                behavior = jsonObject.getJSONObject("per-location").getJSONObject(locationName).getJSONObject("alert-types").getJSONObject("watches").getString(jsonKey);
            } else {
                jsonKey = jsonKey.replace("-advisory", "");
                behavior = jsonObject.getJSONObject("per-location").getJSONObject(locationName).getJSONObject("alert-types").getJSONObject("advisory").getString(jsonKey);
            }
        } catch (Exception e) {
            System.out.println("No location specific setting set.");
        }

        int id = ThreadLocalRandom.current().nextInt(1, 5000 + 1);

        AtmosNotificationBuilder builder =
                new AtmosNotificationBuilder(context)
                        .setTitle(eventTitle + " has been issued for " + locationName)
                        .setBody(eventInfo)
                        .setIcon(iconID);

        if (behavior.contains("silentnotification")) {
            NotificationHandler.notify(id, builder.setChannel("silentnotification").build());
        } else if (behavior.contains("soundnotification")) {
            NotificationHandler.notify(id, builder.setChannel(notificationSound + "notification").build());
        } else if (behavior.contains("alertmove")) {
            boolean moving = settings.getBoolean("currentlyMoving", false);
            if (moving) {
                AtmosNotification notification = builder.setChannel(alertSound + "alert").build();

                if (doTTS) {
                    NotificationHandler.notify(id, notification);

                    new EasyTTS(eventTitle + " has been issued for " + locationName + ". " + eventInfo, context.getApplicationContext());
                } else {
                    NotificationHandler.notifyInsistently(id, notification);
                }
            } else {
                return false;
            }
        } else if (behavior.contains("alert")) {
            AtmosNotification notification = builder.setChannel(alertSound + "alert").build();

            if (doTTS) {
                NotificationHandler.notify(id, notification);

                new EasyTTS(eventTitle + " has been issued for " + locationName + ". " + eventInfo, context.getApplicationContext());
            } else {
                NotificationHandler.notifyInsistently(id, notification);
            }
        }

        return true;
    }
}
