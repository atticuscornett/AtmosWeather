package io.atticusc.atmosweather;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Locale;
import java.util.concurrent.ThreadLocalRandom;

public class InformWeather {
    public InformWeather(String eventTitle, String locationName, String eventInfo, Context context){
        SharedPreferences settings = context.getSharedPreferences("NativeStorage", 0);
        String defaultSettings = "{\"location\":{\"weather\":true,\"alerts\":true},\"notifications\":{\"severe-future\":true,\"rain-future\":false},\"location-alerts\":{\"default-alert\":\"readynow\",\"default-notification\":\"readynow\",\"locations\":{}},\"alert-types\":{\"warnings\":{\"tornado\":\"alert\",\"hurricane\":\"alert\",\"hurricane-force-wind\":\"alert\",\"tropical-storm\":\"alert\",\"special-marine\":\"alert\",\"severe-thunderstorm\":\"alert\",\"storm\":\"alert\",\"gale\":\"alert\",\"flash-flood\":\"alertmove\",\"flood\":\"alertmove\",\"coastal-flood\":\"alertmove\",\"river-flood\":\"alertmove\",\"high-wind\":\"soundnotification\",\"extreme-wind\":\"alert\",\"excessive-heat\":\"soundnotification\",\"fire-weather\":\"alert\",\"blizzard\":\"alert\",\"snow-squall\":\"alertmove\",\"ice-storm\":\"alert\",\"winter-storm\":\"alert\",\"freeze\":\"soundnotification\",\"wind-chill\":\"soundnotification\"},\"watches\":{\"tornado\":\"soundnotification\",\"hurricane\":\"soundnotification\",\"tropical-storm\":\"soundnotification\",\"severe-thunderstorm\":\"soundnotification\",\"flash-flood\":\"soundnotification\",\"flood\":\"soundnotification\",\"coastal-flood\":\"soundnotification\",\"river-flood\":\"soundnotification\",\"high-wind\":\"soundnotification\",\"excessive-heat\":\"soundnotification\",\"fire-weather\":\"soundnotification\",\"winter-storm\":\"soundnotification\",\"freeze\":\"soundnotification\"},\"advisory\":{\"wind\":\"soundnotification\",\"winter-weather\":\"soundnotification\",\"frost\":\"soundnotification\",\"wind-chill\":\"soundnotification\",\"heat\":\"soundnotification\",\"dense-fog\":\"soundnotification\",\"small-craft\":\"soundnotification\",\"coastal-flood\":\"soundnotification\"}},\"per-location\":{}}";
        JSONObject jsonObject = null;
        String alertSound = "readynow";
        String notificationSound = "readynow";
        try {
            jsonObject = new JSONObject(settings.getString("settings", defaultSettings));
            alertSound = jsonObject.getJSONObject("location-alerts").getString("default-alert");
            notificationSound = jsonObject.getJSONObject("location-alerts").getString("default-notification");
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
        String jsonKey = eventTitle.toLowerCase(Locale.ROOT).replaceAll(" ", "-");
        String behavior = "soundnotification";
        int iconID = R.drawable.lightning_icon;
        try {
            if (jsonKey.contains("warning")){
                jsonKey = jsonKey.replace("-warning", "");
                behavior = jsonObject.getJSONObject("alert-types").getJSONObject("warnings").getString(jsonKey);
                iconID = R.drawable.warning_icon;
            }
            else if (jsonKey.contains("watch")){
                jsonKey = jsonKey.replace("-warning", "");
                behavior = jsonObject.getJSONObject("alert-types").getJSONObject("watches").getString(jsonKey);
                iconID = R.drawable.watch_icon;
            }
            else{
                jsonKey = jsonKey.replace("-advisory", "");
                behavior = jsonObject.getJSONObject("alert-types").getJSONObject("advisory").getString(jsonKey);
            }
        }
        catch (Exception e){
            System.out.println("Hmm... something went wrong parsing json.");
        }
        jsonKey = eventTitle.toLowerCase(Locale.ROOT).replaceAll(" ", "-");
        try {
            if (jsonKey.contains("warning")){
                jsonKey = jsonKey.replace("-warning", "");
                behavior = jsonObject.getJSONObject("per-location").getJSONObject(locationName).getJSONObject("alert-types").getJSONObject("warnings").getString(jsonKey);
            }
            else if (jsonKey.contains("watch")){
                jsonKey = jsonKey.replace("-watch", "");
                behavior = jsonObject.getJSONObject("per-location").getJSONObject(locationName).getJSONObject("alert-types").getJSONObject("watches").getString(jsonKey);
            }
            else{
                jsonKey = jsonKey.replace("-advisory", "");
                behavior = jsonObject.getJSONObject("per-location").getJSONObject(locationName).getJSONObject("alert-types").getJSONObject("advisory").getString(jsonKey);
            }
        }
        catch (Exception e){
            System.out.println("No location specific setting set.");
        }
        if (behavior.contains("silentnotification")){
            new SimpleNotification().Notify(eventTitle + " has been issued for " + locationName, eventInfo, "silentnotification", context, iconID, ThreadLocalRandom.current().nextInt(1, 5000+1));
        }
        else if (behavior.contains("soundnotification")){
            new SimpleNotification().Notify(eventTitle + " has been issued for " + locationName, eventInfo, notificationSound + "notification", context, iconID, ThreadLocalRandom.current().nextInt(1, 5000 + 1));
        }
        else if (behavior.contains("alert")){
            new SimpleNotification().NotifyInsistently(eventTitle + " has been issued for " + locationName, eventInfo, alertSound + "alert", context, iconID, ThreadLocalRandom.current().nextInt(1, 5000 + 1));
        }
        else if (behavior.contains("alertmove")){
            //TODO
            System.out.println("welp");
        }
    }
}
