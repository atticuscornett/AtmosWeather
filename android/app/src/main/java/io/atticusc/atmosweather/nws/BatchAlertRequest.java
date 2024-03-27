package io.atticusc.atmosweather.nws;

import android.content.Context;

import com.android.volley.Request;
import com.android.volley.toolbox.StringRequest;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class BatchAlertRequest extends StringRequest {
    public BatchAlertRequest(JSONObject locationCache, JSONArray locationNames, Context context) {
        super(Request.Method.GET, createAlertLink(locationCache, locationNames), new BatchAlertListener(context), null);
    }

    @Override
    public Map<String, String> getHeaders(){
        Map<String, String> headers = new HashMap<>();
        headers.put("User-agent", "Atmos Weather Background Service");
        return headers;
    }

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

    private static String createAlertLink(JSONObject locationCache, JSONArray locationNames){
        ArrayList<String> ugcCodes = new ArrayList<>();
        try {
            ugcCodes = getAllUGCCodes(locationCache, locationNames);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
        return "https://api.weather.gov/alerts/active?zone=" + String.join(",", ugcCodes);
    }
}
