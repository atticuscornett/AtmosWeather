package io.atticusc.atmosweather;

import android.Manifest;
import android.app.Activity;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.ContextWrapper;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.location.Location;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnSuccessListener;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Calendar;
import java.util.concurrent.Executor;

public class BackgroundService extends BroadcastReceiver {
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
            weatherLocations.edit().putInt("nextcheck", checkLocation).commit();
            AlarmManager alarmManager = (AlarmManager) context.getSystemService(context.ALARM_SERVICE);
            Intent intentA = new Intent(context, BackgroundService.class);
            PendingIntent pentent = PendingIntent.getBroadcast(context, 1, intentA, 0);
            Calendar c = Calendar.getInstance();
            alarmManager.setExact(AlarmManager.RTC_WAKEUP, c.getTimeInMillis() + 10000, pentent);
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
                                        new NWSData().GetAlerts(String.valueOf(location.getLatitude()), String.valueOf(location.getLongitude()), "Current Location", context);
                                    }
                                }
                            });
                }
            }
            getLocationNow ++;
            if (getLocationNow >= 3){
                getLocationNow = 0;
            }
            weatherLocations.edit().putInt("locationchecktime", getLocationNow).commit();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
