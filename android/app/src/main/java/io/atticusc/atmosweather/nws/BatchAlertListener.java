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

public class BatchAlertListener implements Response.Listener<java.lang.String>{
    private final Context context;
    public BatchAlertListener(Context context){
        this.context = context;
    }
    private static String determineAlertLocation(JSONObject alert, JSONArray locationNames, JSONArray weatherLocations, JSONObject locationCache) throws JSONException {
        if (alert.has("geometry") && !alert.isNull("geometry")){
            System.out.println("Has geometry");
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
                        String locationName = locationNames.getString(j);
                        JSONObject location = new JSONObject(locationCache.getString(locationName));
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
                e.printStackTrace();
            }
        }
        return null;
    }

    @Override
    public void onResponse(String response) {
        try {
            JSONObject jsonResponse = new JSONObject(response);
            if (jsonResponse.has("features")){
                JSONArray alerts = jsonResponse.getJSONArray("features");
                SharedPreferences sharedPreferences = context.getSharedPreferences("NativeStorage", Context.MODE_MULTI_PROCESS);
                JSONObject locationCache = new JSONObject(sharedPreferences.getString("location-cache", "{}"));
                JSONArray locationNames = new JSONArray(sharedPreferences.getString("location-names", "[]"));
                JSONArray weatherLocations = new JSONArray(sharedPreferences.getString("weather-locations", "[]"));
                for (int i = 0; i < alerts.length(); i++) {
                    JSONObject alert = alerts.getJSONObject(i);
                    String locationName = determineAlertLocation(alert, locationNames, weatherLocations, locationCache);
                    if (locationName != null){

                    }
                    System.out.println(alert);
                    System.out.println("Location: " + locationName);
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
}
