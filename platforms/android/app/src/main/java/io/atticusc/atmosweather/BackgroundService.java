package io.atticusc.atmosweather;

import android.Manifest;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.location.Location;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Build;
import android.os.Looper;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnSuccessListener;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.concurrent.Executor;

import io.atticusc.atmosweather.notifications.AtmosNotificationBuilder;
import io.atticusc.atmosweather.notifications.NotificationHandler;
import io.atticusc.atmosweather.nws.NWSData;

public class BackgroundService extends BroadcastReceiver {
    double lastLat = 0.0;
    double lastLon = 0.0;
    @Override
    public void onReceive(Context context, Intent intent) {
        FusedLocationProviderClient fusedLocationClient = LocationServices.getFusedLocationProviderClient(context);
        SharedPreferences weatherLocations = context.getSharedPreferences("NativeStorage", Context.MODE_MULTI_PROCESS);
        try {
            JSONArray locationJSON = new JSONArray(weatherLocations.getString("locations", "[]"));
            JSONArray locationNameJSON = new JSONArray(weatherLocations.getString("location-names", "[]"));
            Integer checkLocation = weatherLocations.getInt("nextcheck", 0);
            if (checkLocation >= locationJSON.length()){
                checkLocation = 0;
            }
            if (locationJSON.length() > 0){
                System.out.println("Checking " + locationNameJSON.getString(checkLocation));
                new NWSData().GetAlerts(locationJSON.getJSONObject(checkLocation).getString("lat"), locationJSON.getJSONObject(checkLocation).getString("lon"), locationNameJSON.getString(checkLocation), context);
            }
            checkLocation += 1;
            // new EasyTTS("Test", context.getApplicationContext());
            // System.out.println(checkNetworkStatus(context));
            weatherLocations.edit().putInt("nextcheck", checkLocation).commit();
            AlarmManager alarmManager = (AlarmManager) context.getSystemService(context.ALARM_SERVICE);
            Intent intentA = new Intent(context, BackgroundService.class);
            PendingIntent pentent = PendingIntent.getBroadcast(context, 1, intentA, 0);
            Calendar c = Calendar.getInstance();
            // Update more often on WiFi
            if (checkNetworkStatus(context)){
                alarmManager.setExact(AlarmManager.RTC_WAKEUP, c.getTimeInMillis() + 10000, pentent);
            }
            else{
                alarmManager.setExact(AlarmManager.RTC_WAKEUP, c.getTimeInMillis() + 25000, pentent);
            }

            JSONObject jObj = new JSONObject(weatherLocations.getString("settings", ""));
            Boolean getLocationInBackground = true;
                try {
                    if (jObj.getJSONObject("location").getBoolean("alerts")) {
                        getLocationInBackground = true;
                    } else {
                        getLocationInBackground = false;
                    }
                }
                catch (Exception e){

                }
            int getLocationNow = weatherLocations.getInt("locationchecktime", 0);
            System.out.println(getLocationNow);
            if (getLocationNow == 0 && getLocationInBackground){
                if (ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_BACKGROUND_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                    fusedLocationClient.getLastLocation()
                            .addOnSuccessListener((Executor) ContextCompat.getMainExecutor(context), new OnSuccessListener<Location>() {
                                @Override
                                public void onSuccess(Location location) {
                                    // Got last known location. In some rare situations this can be null.
                                    if (location != null) {
                                        lastLat = Double.valueOf(weatherLocations.getString("lastLat", "0.0"));
                                        lastLon = Double.valueOf(weatherLocations.getString("lastLon", "0.0"));
                                        double dist = Math.pow(Math.pow(location.getLatitude() - lastLat, 2) + Math.pow(location.getLongitude() - lastLon, 2), 0.5);
                                        System.out.println("Last lat " + lastLat);
                                        System.out.println("Last lon" + lastLon);
                                        System.out.println("Distance: " + dist);
                                        Boolean moving = dist > 0.00075;
                                        System.out.println("Is moving: " + moving);
                                        new NWSData().GetAlerts(String.valueOf(location.getLatitude()), String.valueOf(location.getLongitude()), "Current Location", context);
                                        weatherLocations.edit().putBoolean("currentlyMoving", moving).commit();
                                        weatherLocations.edit().putString("lastLat", String.valueOf(location.getLatitude())).commit();
                                        weatherLocations.edit().putString("lastLon", String.valueOf(location.getLongitude())).commit();
                                        getCurrentLocation(context);
                                    }
                                }
                            });
                }
                else {
                    SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
                    Date date = new Date();
                    if (weatherLocations.getString("last-background-location-warning", "na").equals(formatter.format(date)) == false) {

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

                        weatherLocations.edit().putString("last-background-location-warning", formatter.format(date)).commit();
                    }
                }
            }
            getLocationNow ++;
            if (getLocationNow >= 9){
                getLocationNow = 0;
            }
            weatherLocations.edit().putInt("locationchecktime", getLocationNow).commit();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    private LocationRequest locationRequest;
    private void getCurrentLocation(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            locationRequest = LocationRequest.create();
            locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
            locationRequest.setInterval(5000);
            locationRequest.setFastestInterval(2000);
            if (ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                LocationServices.getFusedLocationProviderClient(context)
                        .requestLocationUpdates(locationRequest, new LocationCallback() {
                            @Override
                            public void onLocationResult(@NonNull LocationResult locationResult) {
                                super.onLocationResult(locationResult);

                                LocationServices.getFusedLocationProviderClient(context)
                                        .removeLocationUpdates(this);

                                if (locationResult != null && locationResult.getLocations().size() >0){

                                    int index = locationResult.getLocations().size() - 1;
                                    double latitude = locationResult.getLocations().get(index).getLatitude();
                                    double longitude = locationResult.getLocations().get(index).getLongitude();
                                }
                            }
                        }, Looper.getMainLooper());
            }
        }
    }
    private static boolean checkNetworkStatus(final Context context) {
        ConnectivityManager cm =
                (ConnectivityManager)context.getSystemService(Context.CONNECTIVITY_SERVICE);

        NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
        boolean networkStatus;
        if (activeNetwork == null){
            networkStatus = false;
        }
        else {
            networkStatus = activeNetwork.getType() == ConnectivityManager.TYPE_WIFI;
        }
        return networkStatus;

    }
}
