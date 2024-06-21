package io.atticusc.atmosweather;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.location.Criteria;
import android.location.LocationManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.widget.RemoteViews;

import androidx.core.app.ActivityCompat;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import io.atticusc.atmosweather.notifications.AtmosNotificationBuilder;
import io.atticusc.atmosweather.notifications.NotificationHandler;
import io.atticusc.atmosweather.nws.NWSData;

public class BackgroundService extends BroadcastReceiver {
    double lastLat = 0.0;
    double lastLon = 0.0;

    private static boolean checkNetworkStatus(final Context context) {
        ConnectivityManager connectivityManager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);

        NetworkInfo activeNetwork = connectivityManager.getActiveNetworkInfo();
        boolean networkStatus;
        if (activeNetwork == null) {
            networkStatus = false;
        } else {
            networkStatus = activeNetwork.getType() == ConnectivityManager.TYPE_WIFI;
        }
        return networkStatus;
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        LocationManager locMan = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
        SharedPreferences weatherLocations = context.getSharedPreferences("NativeStorage", Context.MODE_MULTI_PROCESS);
        try {
            AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);

            Intent intentA = new Intent(context, BackgroundService.class);

            @SuppressLint("UnspecifiedImmutableFlag") PendingIntent pentent = PendingIntent.getBroadcast(context, 1, intentA, PendingIntent.FLAG_IMMUTABLE);
            Calendar calendar = Calendar.getInstance();

            int alertCheckFrequency = 60;

            try {
                JSONObject settings = new JSONObject(weatherLocations.getString("settings", ""));
                alertCheckFrequency = Integer.parseInt(settings.getJSONObject("location-alerts").getString("alert-check-frequency"));
                System.out.println("Alert check frequency: " + alertCheckFrequency);
            }
            catch (Exception e){
                System.out.println("Settings not found. Using default alert check frequency.");
            }

            boolean canScheduleAlarms = true;
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
                canScheduleAlarms = alarmManager.canScheduleExactAlarms();
            }

            if (canScheduleAlarms) {
                alarmManager.setExact(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis() + (alertCheckFrequency * 1000L), pentent);
            }
            else {
                alarmManager.set(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis() + (alertCheckFrequency * 1000L), pentent);
            }

            JSONArray locationJSON = new JSONArray(weatherLocations.getString("locations", "[]"));
            JSONArray locationNameJSON = new JSONArray(weatherLocations.getString("location-names", "[]"));

            int checkLocation = weatherLocations.getInt("nextcheck", 0);
            if (checkLocation >= locationJSON.length()) {
                checkLocation = 0;
            }

            if (locationJSON.length() > 0) {
                System.out.println("Checking " + locationNameJSON.getString(checkLocation));
                new NWSData().GetAlerts(locationJSON.getJSONObject(checkLocation).getString("lat"), locationJSON.getJSONObject(checkLocation).getString("lon"), locationNameJSON.getString(checkLocation), context);
            }
            checkLocation += 1;

            weatherLocations.edit().putInt("nextcheck", checkLocation).apply();

            JSONObject jObj = new JSONObject(weatherLocations.getString("settings", ""));
            boolean getLocationInBackground = true;
                try {
                    getLocationInBackground = jObj.getJSONObject("location").getBoolean("alerts");
                } catch (Exception ignored) {

                }

            int getLocationNow = weatherLocations.getInt("locationchecktime", 0);

            System.out.println(getLocationNow);

            if (getLocationNow == 0 && getLocationInBackground){
                if (ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_BACKGROUND_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                    Criteria criteria = new Criteria();
                    // Use less power on WiFi
                    if (checkNetworkStatus(context)){
                        criteria.setPowerRequirement(Criteria.POWER_LOW);
                    }
                    else{
                        criteria.setAccuracy(Criteria.ACCURACY_FINE);
                    }
                    locMan.requestSingleUpdate(criteria, location -> {
                        if (location != null) {
                            lastLat = Double.parseDouble(weatherLocations.getString("lastLat", "0.0"));
                            lastLon = Double.parseDouble(weatherLocations.getString("lastLon", "0.0"));
                            double dist = Math.pow(Math.pow(location.getLatitude() - lastLat, 2) + Math.pow(location.getLongitude() - lastLon, 2), 0.5);
                            System.out.println("Last lat " + lastLat);
                            System.out.println("Last lon" + lastLon);
                            System.out.println("Distance: " + dist);
                            boolean moving = dist > 0.00075;
                            System.out.println("Is moving: " + moving);
                            weatherLocations.edit().putBoolean("currentlyMoving", moving).apply();
                            weatherLocations.edit().putString("lastLat", String.valueOf(location.getLatitude())).apply();
                            weatherLocations.edit().putString("lastLon", String.valueOf(location.getLongitude())).apply();
                            RequestQueue queue = Volley.newRequestQueue(context);
                            String url = "https://api.weather.gov/points/" + location.getLatitude() + "," + location.getLongitude();
                            if (moving){
                                StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                                        new Response.Listener<String>() {
                                            @Override
                                            public void onResponse(String response) {
                                                try {
                                                    JSONObject currentForecastLink = new JSONObject(response).getJSONObject("properties");
                                                    weatherLocations.edit().putString("currentLocationProperties", currentForecastLink.toString()).apply();
                                                    new NWSData().GetAlerts(String.valueOf(location.getLatitude()), String.valueOf(location.getLongitude()), "Current Location", context);
                                                } catch (JSONException e) {
                                                    e.printStackTrace();
                                                }
                                            }
                                        }, new Response.ErrorListener() {
                                    @Override
                                    public void onErrorResponse(VolleyError error) {
                                        System.out.println("Error getting Current Location forecast link.");
                                    }
                                }){
                                    @Override
                                    public Map<String, String> getHeaders() {
                                        Map<String, String>  params = new HashMap<String, String>();
                                        params.put("User-Agent", "Atmos Weather Background Service");
                                        return params;
                                    }
                                };

                                queue.add(stringRequest);
                            }
                            else{
                                new NWSData().GetAlerts(String.valueOf(location.getLatitude()), String.valueOf(location.getLongitude()), "Current Location", context);
                            }

                        }
                    }, null);
                } else {
                    SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy", Locale.US);
                    Date date = new Date();
                    if (!weatherLocations.getString("last-background-location-warning", "na").equals(formatter.format(date))) {

                        NotificationHandler.notify(
                                8,

                                new AtmosNotificationBuilder(context)
                                        .setTitle("Background Location Permission Warning")
                                        .setBody(
                                                "Atmos Weather cannot access your location in the background. " +
                                                        "This permission is required for Atmos Weather to give " +
                                                        "alerts for the current location. To prevent this notification in the future, " +
                                                        "either enable background location or disable current location alerts in the app."
                                        )
                                        .setChannel("notification")
                                        .setIcon(R.drawable.warning_icon)
                                        .build()
                        );

                        weatherLocations.edit().putString("last-background-location-warning", formatter.format(date)).apply();
                    }
                }
            }

            // Check location every 3 minutes

            getLocationNow++;

            if (getLocationNow >= 3) {
                getLocationNow = 0;
            }
            weatherLocations.edit().putInt("locationchecktime", getLocationNow).apply();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
