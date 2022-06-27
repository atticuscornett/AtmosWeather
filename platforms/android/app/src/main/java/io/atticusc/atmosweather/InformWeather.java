package io.atticusc.atmosweather;

import android.content.Context;
import android.content.SharedPreferences;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Type;
import java.util.ArrayList;

public class InformWeather {
    public InformWeather(String eventTitle, String locationName, String eventInfo, Context context){
        SharedPreferences settings = context.getSharedPreferences("NativeStorage", 0);
        Type objType = new TypeToken<JSONObject>(){}.getType();
        Gson gson = new Gson();
        String defaultSettings = "{\"location\":{\"weather\":true,\"alerts\":true},\"notifications\":{\"severe-future\":true,\"rain-future\":false},\"location-alerts\":{\"default-alert\":\"readynow\",\"default-notification\":\"readynow\",\"locations\":{}},\"alert-types\":{\"warnings\":{\"tornado\":\"alert\",\"hurricane\":\"alert\",\"hurricane-force-wind\":\"alert\",\"tropical-storm\":\"alert\",\"special-marine\":\"alert\",\"severe-thunderstorm\":\"alert\",\"storm\":\"alert\",\"gale\":\"alert\",\"flash-flood\":\"alertmove\",\"flood\":\"alertmove\",\"coastal-flood\":\"alertmove\",\"river-flood\":\"alertmove\",\"high-wind\":\"soundnotification\",\"extreme-wind\":\"alert\",\"excessive-heat\":\"soundnotification\",\"fire-weather\":\"alert\",\"blizzard\":\"alert\",\"snow-squall\":\"alertmove\",\"ice-storm\":\"alert\",\"winter-storm\":\"alert\",\"freeze\":\"soundnotification\",\"wind-chill\":\"soundnotification\"},\"watches\":{\"tornado\":\"soundnotification\",\"hurricane\":\"soundnotification\",\"tropical-storm\":\"soundnotification\",\"severe-thunderstorm\":\"soundnotification\",\"flash-flood\":\"soundnotification\",\"flood\":\"soundnotification\",\"coastal-flood\":\"soundnotification\",\"river-flood\":\"soundnotification\",\"high-wind\":\"soundnotification\",\"excessive-heat\":\"soundnotification\",\"fire-weather\":\"soundnotification\",\"winter-storm\":\"soundnotification\",\"freeze\":\"soundnotification\"},\"advisory\":{\"wind\":\"soundnotification\",\"winter-weather\":\"soundnotification\",\"frost\":\"soundnotification\",\"wind-chill\":\"soundnotification\",\"heat\":\"soundnotification\",\"dense-fog\":\"soundnotification\",\"small-craft\":\"soundnotification\",\"coastal-flood\":\"soundnotification\"}},\"per-location\":{}}";
        JSONObject jsonObject = null;
        try {
            jsonObject = new JSONObject(settings.getString("settings", ""));
        } catch (JSONException e) {
            System.out.println("it unhappy");
            e.printStackTrace();
        }
        try {
            jsonObject = jsonObject.getJSONObject("location-alerts");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        String alertSound = "readynow";
        try {
            alertSound = jsonObject.getString("default-alert");
        } catch (JSONException e) {
            alertSound = "readynow";
        }
        String notificationSound = "readynow";
        try {
            notificationSound = jsonObject.getString("default-notification");
        } catch (JSONException e) {
            notificationSound = "readynow";
        }
        int soundID = R.raw.alternatingtonealarm;
        if (notificationSound == "alternatingtones"){
            soundID = R.raw.alternatingtonenotification;
        }
        new SimpleNotification().Notify(eventTitle + " has been issued for " + locationName, eventInfo, notificationSound + "notification", context, R.drawable.lightning_icon, 2);
        System.out.println("Test obj: " + alertSound);
    }
}
