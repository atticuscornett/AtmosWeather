package io.atticusc.atmosweather;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Calendar;

public class BackgroundService extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
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

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
