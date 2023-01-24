package io.atticusc.atmosweather.nws;

import android.content.Context;

import com.android.volley.RequestQueue;
import com.android.volley.toolbox.Volley;

public class NWSData {
    public void GetAlerts(String lat, String lon, String locationName, Context context){
        RequestQueue queue = Volley.newRequestQueue(context);

        queue.add(new AlertRequest(lat, lon, locationName, context));
    }
}
