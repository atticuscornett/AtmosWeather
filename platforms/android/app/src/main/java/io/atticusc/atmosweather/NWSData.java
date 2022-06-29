package io.atticusc.atmosweather;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;

import androidx.annotation.RequiresApi;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.ConnectException;
import java.util.HashMap;
import java.util.Map;

public class NWSData {
    public void GetAlerts(String lat, String lon, String locationName, Context context){
        RequestQueue queue = Volley.newRequestQueue(context);
        StringRequest stringRequest = new StringRequest(Request.Method.GET, "https://api.weather.gov/alerts/active?point=" + lat + "," + lon,
                new Response.Listener<String>() {
                    public void onResponse(String response) {
                        try {
                            JSONObject jsonObject = new JSONObject(response);
                            JSONObject current;
                            JSONArray jsonArray = jsonObject.getJSONArray("features");
                            Integer a = 0;
                            while (a < jsonArray.length()){
                                current = jsonArray.getJSONObject(a);
                                current = current.getJSONObject("properties");
                                new InformWeather(current.getString("event"), locationName, current.getString("description"), context);
                                System.out.println(current);
                                a++;
                            }
                        } catch (Exception e) {
                            System.out.println("oof");
                            e.printStackTrace();
                        }


                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {

            }
        }){@Override
        public Map<String, String> getHeaders(){
            Map<String, String> headers = new HashMap<String, String>();
            headers.put("User-agent", "Atmos Weather Background Service");
            return headers;
        }};
        queue.add(stringRequest);
    }
}
