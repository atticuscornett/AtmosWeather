package io.atticusc.atmosweather.nws;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;

import org.geotools.geojson.geom.GeometryJSON;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Polygon;

public class AlertGrabber {
    private static ArrayList<String> getAllUGCCodes(JSONObject locationCache, JSONArray locationNames) throws JSONException {
        ArrayList<String> codes = new ArrayList<>();
        String locationName;
        for (int i = 0; i < locationNames.length(); i++){
            locationName = locationNames.getString(i);
            try {
                JSONObject locationData = new JSONObject(locationCache.getString(locationName));
                JSONObject properties = locationData.getJSONObject("properties");

                if (properties.has("county")){
                    String county = properties.getString("county");
                    county = county.substring(county.length() - 6);
                    if (!codes.contains(county)){
                        codes.add(county);
                    }
                }

                if (properties.has("forecastZone")){
                    String forecastZone = properties.getString("forecastZone");
                    forecastZone = forecastZone.substring(forecastZone.length() - 6);
                    if (!codes.contains(forecastZone)){
                        codes.add(forecastZone);
                    }
                }

                if (properties.has("fireWeatherZone")){
                    String fireWeatherZone = properties.getString("fireWeatherZone");
                    fireWeatherZone = fireWeatherZone.substring(fireWeatherZone.length() - 6);
                    if (!codes.contains(fireWeatherZone)){
                        codes.add(fireWeatherZone);
                    }
                }
            } catch (Exception e){
                e.printStackTrace();
            }
        }
        return codes;
    }

    public static String createAlertLink(JSONObject locationCache, JSONArray locationNames){
        ArrayList<String> ugcCodes = new ArrayList<>();
        try {
            ugcCodes = getAllUGCCodes(locationCache, locationNames);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
        return "https://api.weather.gov/alerts/active?zone=" + String.join(",", ugcCodes);
    }

    private static String determineAlertLocation(JSONObject alert, JSONArray locationNames, JSONArray weatherLocations, JSONObject locationCache) {
        if (alert.has("geometry")){
            try {
                GeometryJSON geoJsonReader = new GeometryJSON();
                JSONObject alertGeometryJSON = alert.getJSONObject("geometry");
                Polygon alertGeometry = (Polygon) geoJsonReader.read(alertGeometryJSON.toString());
                GeometryFactory geometryFactory = new GeometryFactory();
                for (int i = 0; i < weatherLocations.length(); i++) {
                    JSONObject location = weatherLocations.getJSONObject(i);
                    Point locationPoint = geometryFactory.createPoint(
                            new Coordinate(location.getDouble("longitude"), location.getDouble("latitude"))
                    );
                    if (alertGeometry.contains(locationPoint)){
                        return locationNames.getString(i);
                    }
                }
            } catch (JSONException | IOException e) {
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
}
