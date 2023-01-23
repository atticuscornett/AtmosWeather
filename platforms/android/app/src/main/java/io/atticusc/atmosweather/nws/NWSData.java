package io.atticusc.atmosweather.nws;

import android.content.Context;
import android.content.SharedPreferences;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import org.json.JSONArray;
import org.json.JSONObject;

import java.lang.reflect.Type;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import io.atticusc.atmosweather.InformWeather;
import io.atticusc.atmosweather.R;
import io.atticusc.atmosweather.SimpleNotification;

public class NWSData {
    public void GetAlerts(String lat, String lon, String locationName, Context context){
        RequestQueue queue = Volley.newRequestQueue(context);
        StringRequest stringRequest = new StringRequest(Request.Method.GET, "https://api.weather.gov/alerts/active?point=" + lat + "," + lon,
                response -> {
                    try {
                        SharedPreferences sharedPreferences = context.getSharedPreferences("NativeStorage", Context.MODE_MULTI_PROCESS);
                        ArrayList<String> stringArray = new ArrayList<>();

                        JSONArray jsonArray = new JSONArray(sharedPreferences.getString("alerted", "[]"));

                        for (int i = 0; i < jsonArray.length(); i++) {
                            stringArray.add(jsonArray.getString(i));
                        }
                        JSONObject jsonObject = new JSONObject(response);
                        JSONObject current;
                        jsonArray = jsonObject.getJSONArray("features");
                        Integer a = 0;
                        System.out.println(jsonArray);
                        while (a < jsonArray.length()){
                            current = jsonArray.getJSONObject(a);
                            current = current.getJSONObject("properties");
                            if (!stringArray.contains(current.getString("@id"))){
                                if (InformWeather.InformWeatherReturn(current.getString("event"), locationName, current.getString("description"), context)){
                                    stringArray.add(current.getString("@id"));
                                }
                            }

                            a++;
                        }
                        Gson gson = new Gson();
                        Type objType = new TypeToken<ArrayList<String>>(){}.getType();
                        String s = gson.toJson(stringArray, objType);
                        sharedPreferences.edit().putString("alerted", s).commit();
                        try{
                            JSONObject get = new JSONObject(sharedPreferences.getString("location-cache", ""));
                            get = new JSONObject(get.getString(locationName));
                            get = get.getJSONObject("properties");
                            String forecastLink = get.getString("forecast");
                            get = new JSONObject(sharedPreferences.getString("settings", ""));
                            get = get.getJSONObject("notifications");
                            Boolean severe = get.getBoolean("severe-future");
                            Boolean rain = get.getBoolean("rain-future");
                            try{
                                get = new JSONObject(sharedPreferences.getString("settings", ""));
                                get = get.getJSONObject("per-location").getJSONObject(locationName);
                                get = get.getJSONObject("notifications");
                                severe = get.getBoolean("severe-future");
                                rain = get.getBoolean("rain-future");
                            }
                            catch (Exception ignored){

                            }
                            SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
                            Date date = new Date();
                            RequestQueue queue2 = Volley.newRequestQueue(context);
                            Boolean finalSevere = severe;
                            Boolean finalRain = rain;
                            StringRequest stringRequest2 = new StringRequest(Request.Method.GET, forecastLink,
                                    response1 -> {
                                        try {
                                            // Check settings and give notification if weather trigger words detected
                                            JSONObject jsonObject1 = new JSONObject(response1);
                                            jsonObject1 = jsonObject1.getJSONObject("properties");
                                            JSONArray jsonArray1 = jsonObject1.getJSONArray("periods");
                                            jsonObject1 = jsonArray1.getJSONObject(0);
                                            String longForecast = jsonObject1.getString("detailedForecast");
                                            jsonObject1 = jsonArray1.getJSONObject(1);
                                            longForecast += jsonObject1.getString("detailedForecast");
                                            Boolean severeIndicate = false;
                                            Boolean rainIndicate = false;
                                            response1 = longForecast.toLowerCase(Locale.ROOT);
                                            if (response1.contains("severe") || response1.contains("tropical storm") || response1.contains("damage") || response1.contains("damaging") || response1.contains("hurricane") || response1.contains("tornado")){
                                                severeIndicate = true;
                                            }
                                            if (response1.contains("storm") || response1.contains("rain")){
                                                rainIndicate = true;
                                            }
                                            if (finalSevere && severeIndicate){
                                                new SimpleNotification().Notify("Future Severe Weather Expected for " + locationName, jsonObject1.getString("detailedForecast"), "notification", context, R.drawable.future_icon, 2);
                                            }
                                            else if (rainIndicate && finalRain){
                                                new SimpleNotification().Notify("Future Rain or Storms Expected for " + locationName, jsonObject1.getString("detailedForecast"), "notification", context, R.drawable.future_icon, 2);
                                            }
                                        }
                                        catch (Exception ignored){

                                        }

                                    }, error -> {

                                    }){@Override
                            public Map<String, String> getHeaders(){
                                Map<String, String> headers = new HashMap<>();
                                headers.put("User-agent", "Atmos Weather Background Service");
                                return headers;
                            }};
                            if (!formatter.format(date).equals(sharedPreferences.getString(locationName + "-lastNotif", ""))){
                                if (severe || rain){
                                    queue2.add(stringRequest2);
                                    System.out.println("Daily notif for " + locationName);
                                    sharedPreferences.edit().putString(locationName + "-lastNotif", formatter.format(date)).commit();
                                }


                            }
                        }
                        catch (Exception e){
                            e.printStackTrace();
                        }

                    } catch (Exception e) {
                        e.printStackTrace();
                    }


                }, error -> {

                }){@Override
        public Map<String, String> getHeaders(){
            Map<String, String> headers = new HashMap<>();
            headers.put("User-agent", "Atmos Weather Background Service");
            return headers;
        }};
        queue.add(stringRequest);
    }
}
