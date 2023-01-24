package io.atticusc.atmosweather.nws;

import android.content.Context;

import com.android.volley.Response;

import org.json.JSONArray;
import org.json.JSONObject;

import io.atticusc.atmosweather.R;
import io.atticusc.atmosweather.SimpleNotification;

public class ForecastListener implements Response.Listener<String> {
    private static final String[] severeWeatherTypes = {
            "severe",
            "tropical storm",
            "damage",
            "damaging",
            "hurricane",
            "tornado"
    };

    private static final String[] rainTypes = {
            "storm",
            "rain"
    };

    private final boolean severe, rain;
    private final String locationName;
    private final Context context;

    public ForecastListener(boolean severe, boolean rain, String locationName, Context context) {
        this.severe = severe;
        this.rain = rain;
        this.locationName = locationName;
        this.context = context;
    }


    @Override
    public void onResponse(String response) {
        try {
            // Check settings and give notification if weather trigger words detected
            JSONObject jsonResponse = new JSONObject(response); // Interpret the response
            JSONObject properties = jsonResponse.getJSONObject("properties"); // Get Properties

            JSONArray periods = properties.getJSONArray("periods"); // Get the periods inside

            JSONObject firstPeriod = periods.getJSONObject(0);

            String longForecast = firstPeriod.getString("detailedForecast");

            JSONObject secondPeriod = periods.getJSONObject(1);

            String completeForecast = (longForecast + secondPeriod.getString("detailedForecast")).toLowerCase();

            boolean severeIndicate = isSevere(completeForecast);
            boolean rainIndicate = isRain(completeForecast);

            if (severe && severeIndicate){
                new SimpleNotification().Notify("Future Severe Weather Expected for " + locationName, jsonResponse.getString("detailedForecast"), "notification", context, R.drawable.future_icon, 2);
            }

            else if (rain && rainIndicate ){
                new SimpleNotification().Notify("Future Rain or Storms Expected for " + locationName, jsonResponse.getString("detailedForecast"), "notification", context, R.drawable.future_icon, 2);
            }
        }
        catch (Exception ignored){

        }
    }

    private static boolean isSevere(String request) {
        for (String requestType : severeWeatherTypes) {
            if (request.contains(requestType)) {
                return true;
            }
        }

        return false;
    }

    private static boolean isRain(String request) {
        for (String rainType : rainTypes) {
            if (request.contains(rainType)) {
                return true;
            }
        }

        return false;
    }
}
