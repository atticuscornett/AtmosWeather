package io.atticusc.atmosweather.nws;

import android.content.Context;

import com.android.volley.toolbox.StringRequest;

import java.util.HashMap;
import java.util.Map;

public class ForecastRequest extends StringRequest {
    public ForecastRequest(String url, boolean severe, boolean rain, String locationName, Context context) {
        super(Method.GET, url, new ForecastListener(severe, rain, locationName, context), null);
    }

    @Override
    public Map<String, String> getHeaders(){
        Map<String, String> headers = new HashMap<>();
        headers.put("User-agent", "Atmos Weather Background Service");
        return headers;
    }
}
