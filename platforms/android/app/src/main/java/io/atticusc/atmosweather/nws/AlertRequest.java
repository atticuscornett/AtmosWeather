package io.atticusc.atmosweather.nws;

import android.content.Context;

import com.android.volley.Request;
import com.android.volley.toolbox.StringRequest;

import java.util.HashMap;
import java.util.Map;

public class AlertRequest extends StringRequest {
    public AlertRequest(String latitude, String longitude, String locationName, Context context) {
        super(Request.Method.GET, "https://api.weather.gov/alerts/active?point=" + latitude + "," + longitude, new AlertListener(locationName, context), null);
    }

    @Override
    public Map<String, String> getHeaders(){
        Map<String, String> headers = new HashMap<>();
        headers.put("User-agent", "Atmos Weather Background Service");
        return headers;
    }
}
