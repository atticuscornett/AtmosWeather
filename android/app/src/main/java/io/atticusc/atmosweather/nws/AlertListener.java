package io.atticusc.atmosweather.nws;

import android.content.Context;
import android.content.SharedPreferences;

import com.android.volley.Response;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import org.json.JSONArray;
import org.json.JSONException;
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

    private static void serializeAlerts(String[] alerts, SharedPreferences sharedPreferences) {
        Gson gson = new Gson();
        Type objType = new TypeToken<String[]>() {
        }.getType();
        String s = gson.toJson(alerts, objType);
        sharedPreferences.edit().putString("alerted", s).apply();
    }

    @Override
    public void onResponse(String response) {
        try {
            JSONObject responseJson = new JSONObject(response);

            SharedPreferences sharedPreferences = context.getSharedPreferences("NativeStorage", Context.MODE_MULTI_PROCESS);

            String[] alerts = getAlerts(sharedPreferences, responseJson);

            serializeAlerts(alerts, sharedPreferences);

            JSONForecast forecast = new JSONForecast(sharedPreferences, locationName);
            forecast.attemptNotify(context);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Returns all relevant alerts found in the responseJson and stored on the users device
     *
     * @param preferences  The preferences to search for alerts that have already been sent
     * @param responseJson The json to get the active alerts from
     */
    private String[] getAlerts(SharedPreferences preferences, JSONObject responseJson) throws JSONException {
        ArrayList<String> results = new ArrayList<>();

        JSONArray notifiedAlerts = new JSONArray(preferences.getString("alerted", "[]"));

        for (int i = 0; i < notifiedAlerts.length(); i++) {
            results.add(notifiedAlerts.getString(i));
        }

        JSONArray activeAlerts = responseJson.getJSONArray("features");

        for (int i = 0; i < activeAlerts.length(); i++) {
            JSONObject current = activeAlerts.getJSONObject(i).getJSONObject("properties");

            if (!results.contains(current.getString("@id"))) {
                if (InformWeather.InformWeatherReturn(current.getString("event"), locationName, current.getString("description"), context)) {
                    results.add(current.getString("@id"));
                }
            }
        }

        return results.toArray(new String[0]);
    }
}
