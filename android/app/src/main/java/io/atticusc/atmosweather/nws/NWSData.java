package io.atticusc.atmosweather.nws;

import android.content.Context;
import android.content.SharedPreferences;

import com.android.volley.RequestQueue;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class NWSData {
    public void GetAlerts(String lat, String lon, String locationName, Context context){
        RequestQueue queue = Volley.newRequestQueue(context);

        JSONObject locationCache = new JSONObject();
        JSONArray locationNames = new JSONArray();
        SharedPreferences sharedPreferences = context.getSharedPreferences("NativeStorage", Context.MODE_MULTI_PROCESS);
        try {
            locationCache = new JSONObject(sharedPreferences.getString("location-cache", "{}"));
            locationNames = new JSONArray(sharedPreferences.getString("location-names", "[]"));
        }
        catch (Exception e){
            e.printStackTrace();
        }

        queue.add(new BatchAlertRequest(locationCache, locationNames, context));

        // Notify about future storms
        try {
            JSONForecast forecast = new JSONForecast(sharedPreferences, locationName);
            forecast.attemptNotify(context);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
    }
}
