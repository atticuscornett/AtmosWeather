package io.atticusc.atmosweather.nws;

import android.content.Context;
import android.content.SharedPreferences;

import com.android.volley.Response;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Polygon;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Map;

import io.atticusc.atmosweather.InformWeather;

public class BatchAlertListener implements Response.Listener<java.lang.String>{
    private final Context context;
    public BatchAlertListener(Context context){
        this.context = context;
    }
    private static String determineAlertLocation(JSONObject alert, JSONArray locationNames, JSONArray weatherLocations, JSONObject locationCache) throws JSONException {
        boolean hasCompatibleGeometry = false;

        // Check if alert is basic polygon
        try {
            if (alert.has("geometry") && !alert.isNull("geometry")){
                if (alert.getJSONObject("geometry").has("type")
                    && alert.getJSONObject("geometry").getString("type").equals("Polygon")){
                    hasCompatibleGeometry = true;
                }
            }
        }
        catch (Exception e){
            e.printStackTrace();
        }

        if (hasCompatibleGeometry){
            System.out.println("Has compatible geometry");
            try {
                GeometryFactory geometryFactory = new GeometryFactory();

                // Get coordinates from GeoJSON
                String geoJson = alert.getJSONObject("geometry").toString();
                JsonObject jsonObject = JsonParser.parseString(geoJson).getAsJsonObject();
                JsonArray coordinates = jsonObject.getAsJsonArray("coordinates").get(0).getAsJsonArray();

                // Create a coordinate list from coordinates
                Coordinate[] polygonCoordinates = new Coordinate[coordinates.size()];
                for (int i = 0; i < coordinates.size(); i++) {
                    JsonArray coordinate = coordinates.get(i).getAsJsonArray();
                    double x = coordinate.get(0).getAsDouble();
                    double y = coordinate.get(1).getAsDouble();
                    polygonCoordinates[i] = new Coordinate(x, y);
                }

                // Create polygon from coordinate list
                Polygon alertPolygon = geometryFactory.createPolygon(polygonCoordinates);

                for (int i = 0; i < weatherLocations.length(); i++) {
                    JSONObject location = weatherLocations.getJSONObject(i);

                    // Create coordinate from location
                    Coordinate locationPoint = new Coordinate(location.getDouble("lon"), location.getDouble("lat"));
                    System.out.println("locationPoint:");
                    System.out.println(geometryFactory.createPoint(locationPoint));
                    if (alertPolygon != null && alertPolygon.contains(geometryFactory.createPoint(locationPoint))){
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

            // Check if response is valid
            if (jsonResponse.has("features")){
                // Get required location information
                JSONArray alerts = jsonResponse.getJSONArray("features");
                SharedPreferences sharedPreferences = context.getSharedPreferences("NativeStorage", Context.MODE_MULTI_PROCESS);
                JSONObject locationCache = new JSONObject(sharedPreferences.getString("location-cache", "{}"));
                JSONArray locationNames = new JSONArray(sharedPreferences.getString("location-names", "[]"));
                JSONArray weatherLocations = new JSONArray(sharedPreferences.getString("locations", "[]"));

                // Iterate through alerts and determine location
                for (int i = 0; i < alerts.length(); i++) {
                    JSONObject alert = alerts.getJSONObject(i);
                    String locationName = determineAlertLocation(alert, locationNames, weatherLocations, locationCache);
                    if (locationName != null){
                        // Alert user if necessary
                        String[] alerted = getAlerts(sharedPreferences, locationName, alert);
                        serializeAlerts(alerted, sharedPreferences);
                    }
                    System.out.println(alert);
                    System.out.println("Location: " + locationName);
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private String[] getAlerts(SharedPreferences preferences, String locationName, JSONObject responseJson) throws JSONException {
        ArrayList<String> results = new ArrayList<>();

        JSONArray notifiedAlerts = new JSONArray(preferences.getString("alerted", "[]"));

        for (int i = 0; i < notifiedAlerts.length(); i++) {
            results.add(notifiedAlerts.getString(i));
        }

        JSONObject current = responseJson.getJSONObject("properties");

        if (!results.contains(current.getString("@id"))) {
            if (InformWeather.InformWeatherReturn(current.getString("event"), locationName, current.getString("description"), context)) {
                results.add(current.getString("@id"));
            }
        }

        return results.toArray(new String[0]);
    }

    private static void serializeAlerts(String[] alerts, SharedPreferences sharedPreferences) {
        Gson gson = new Gson();
        Type objType = new TypeToken<String[]>() {
        }.getType();
        String s = gson.toJson(alerts, objType);
        sharedPreferences.edit().putString("alerted", s).apply();
    }
}
