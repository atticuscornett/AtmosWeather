package io.atticusc.atmosweather.nws;

import android.content.Context;
import android.content.SharedPreferences;

import com.android.volley.Response;
import com.mapbox.geojson.Feature;
import com.mapbox.geojson.Point;
import com.mapbox.geojson.Polygon;
import com.mapbox.turf.TurfJoins;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

public class BatchAlertListener implements Response.Listener<java.lang.String>{
    private JSONObject alerts;
    private Context context;
    public BatchAlertListener(Context context){
        this.context = context;
    }
    private static String determineAlertLocation(JSONObject alert, JSONArray locationNames, JSONArray weatherLocations, JSONObject locationCache) {
        if (alert.has("geometry")){
            try {
                Feature alertFeature = Feature.fromJson(alert.toString());
                Polygon alertGeometry = (Polygon) alertFeature.geometry();
                for (int i = 0; i < weatherLocations.length(); i++) {
                    JSONObject location = weatherLocations.getJSONObject(i);
                    Point locationPoint = Point.fromLngLat(location.getDouble("lon"), location.getDouble("lat"));
                    if (alertGeometry != null && TurfJoins.inside(locationPoint, alertGeometry)){
                        return locationNames.getString(i);
                    }
                }
            } catch (JSONException e) {
                throw new RuntimeException(e);
            }
        }
        else {
            try {
                JSONArray zones = alert.getJSONObject("properties").getJSONArray("affectedZones");
                for (int i = 0; i < zones.length(); i++) {
                    String zone = zones.getString(i);
                    for (int j = 0; j < locationNames.length(); j++) {
                        JSONObject location = locationCache.getJSONObject(locationNames.getString(j));
                        String countyUGC = "";
                        String forecastZoneUGC = "";
                        String fireWeatherZoneUGC = "";

                        if (location.getJSONObject("properties").has("county")){
                            countyUGC = location.getJSONObject("properties").getString("county");
                        }

                        if (location.getJSONObject("properties").has("forecastZone")){
                            forecastZoneUGC = location.getJSONObject("properties").getString("forecastZone");
                        }

                        if (location.getJSONObject("properties").has("fireWeatherZone")){
                            fireWeatherZoneUGC = location.getJSONObject("properties").getString("fireWeatherZone");
                        }

                        if (zone.equals(countyUGC) || zone.equals(forecastZoneUGC) || zone.equals(fireWeatherZoneUGC)){
                            return locationNames.getString(j);
                        }
                    }
                }
            } catch (JSONException e) {
                throw new RuntimeException(e);
            }
        }
        return null;
    }

    @Override
    public void onResponse(String response) {
        try {
            alerts = new JSONObject(response);
            System.out.println(alerts);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
    }
}
