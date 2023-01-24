package io.atticusc.atmosweather.nws;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.SharedPreferences;

import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import org.json.JSONArray;
import org.json.JSONObject;

import java.lang.reflect.Type;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import io.atticusc.atmosweather.InformWeather;

public class AlertListener implements Response.Listener<java.lang.String> {
    private final String locationName;
    private final Context context;

    public AlertListener(String locationName, Context context) {
        this.locationName = locationName;
        this.context = context;
    }

    @Override
    public void onResponse(String response) {
        try {
            SharedPreferences sharedPreferences = context.getSharedPreferences("NativeStorage", Context.MODE_MULTI_PROCESS);
            ArrayList<String> stringAlerts = new ArrayList<>();

            JSONArray notifiedAlerts = new JSONArray(sharedPreferences.getString("alerted", "[]"));

            for (int i = 0; i < notifiedAlerts.length(); i++) {
                stringAlerts.add(notifiedAlerts.getString(i));
            }

            JSONObject jsonObject = new JSONObject(response);

            JSONArray activeAlerts = jsonObject.getJSONArray("features");

            for (int i = 0; i < activeAlerts.length(); i++) {
                JSONObject current = activeAlerts.getJSONObject(i).getJSONObject("properties");

                if (!stringAlerts.contains(current.getString("@id"))){
                    if (InformWeather.InformWeatherReturn(current.getString("event"), locationName, current.getString("description"), context)) {
                        stringAlerts.add(current.getString("@id"));
                    }
                }
            }

            serializeAlerts(stringAlerts, sharedPreferences);

            try {
                JSONObject locationCache = new JSONObject(sharedPreferences.getString("location-cache", ""));

                JSONObject location = locationCache.getJSONObject("properties");

                String forecastLink = location.getString("forecast");

                JSONObject settings = new JSONObject(sharedPreferences.getString("settings", ""));
                JSONObject notifications = settings.getJSONObject("notifications");

                boolean severe;
                boolean rain;

                // Check if setting is different from default
                try {
                    JSONObject locationSettings = settings.getJSONObject("per-location").getJSONObject(locationName);
                    JSONObject locationNotifications = locationSettings.getJSONObject("notifications");

                    severe = locationNotifications.getBoolean("severe-future");
                    rain = locationNotifications.getBoolean("rain-future");
                }

                catch (Exception ignored){
                    severe = notifications.getBoolean("severe-future");
                    rain = notifications.getBoolean("rain-future");
                }

                RequestQueue queue = Volley.newRequestQueue(context);

                StringRequest stringRequest2 = new ForecastRequest(forecastLink, severe, rain, locationName, context);

                @SuppressLint("SimpleDateFormat") SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
                Date date = new Date();

                // Check if notification has been sent today
                if (!sdf.format(date).equals(sharedPreferences.getString(locationName + "-lastNotif", ""))){
                    if (severe || rain){
                        queue.add(stringRequest2);
                        System.out.println("Daily notif for " + locationName);
                        sharedPreferences.edit().putString(locationName + "-lastNotif", sdf.format(date)).apply();
                    }
                }
            }
            catch (Exception e){
                e.printStackTrace();
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void serializeAlerts(ArrayList<String> alerts, SharedPreferences sharedPreferences) {
        Gson gson = new Gson();
        Type objType = new TypeToken<ArrayList<String>>(){}.getType();
        String s = gson.toJson(alerts, objType);
        sharedPreferences.edit().putString("alerted", s).apply();
    }
}
