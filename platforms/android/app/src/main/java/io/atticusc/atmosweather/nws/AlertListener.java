package io.atticusc.atmosweather.nws;

import android.content.Context;
import android.content.SharedPreferences;

import com.android.volley.Response;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import org.json.JSONArray;
import org.json.JSONObject;

import java.lang.reflect.Type;
import java.util.ArrayList;

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

            JSONObject responseJson = new JSONObject(response);

            JSONArray activeAlerts = responseJson.getJSONArray("features");

            for (int i = 0; i < activeAlerts.length(); i++) {
                JSONObject current = activeAlerts.getJSONObject(i).getJSONObject("properties");

                if (!stringAlerts.contains(current.getString("@id"))) {
                    if (InformWeather.InformWeatherReturn(current.getString("event"), locationName, current.getString("description"), context)) {
                        stringAlerts.add(current.getString("@id"));
                    }
                }
            }

            serializeAlerts(stringAlerts, sharedPreferences);

            JSONForecast forecast = new JSONForecast(sharedPreferences, locationName);
            forecast.attemptNotify(context);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void serializeAlerts(ArrayList<String> alerts, SharedPreferences sharedPreferences) {
        Gson gson = new Gson();
        Type objType = new TypeToken<ArrayList<String>>() {
        }.getType();
        String s = gson.toJson(alerts, objType);
        sharedPreferences.edit().putString("alerted", s).apply();
    }
}
