/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package io.atticusc.atmosweather;

import android.Manifest;
import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.ContentResolver;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.location.Location;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import androidx.core.app.ActivityCompat;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnSuccessListener;

import org.apache.cordova.*;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends CordovaActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // enable Cordova apps to be started in the background
        Bundle extras = getIntent().getExtras();
        if (extras != null && extras.getBoolean("cdvStartInBackground", false)) {
            moveTaskToBack(true);
        }

            // Set by <content src="index.html" /> in config.xml
        loadUrl(launchUrl);
//        new SimpleNotification().PrepareNotificationChannel("banana", "banana", getApplicationContext());
//        new SimpleNotification().PrepareNotificationChannel("insist", "insist", getApplicationContext());
//        new SimpleNotification().NotifyWithAudio("Testing", "This is a test notification.", "banana", getApplicationContext(), R.drawable.ic_android_black_24dp, 1, Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://"+ getApplicationContext().getPackageName() + "/" + R.raw.metronome));
        new SimpleNotification().PrepareNotificationChannelWithAudio("simplebeepsalert", "Simple Beep Alert", getApplicationContext(), Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getApplicationContext().getPackageName() + "/" + R.raw.simplebeepalarm));
        new SimpleNotification().PrepareNotificationChannelWithAudio("simplebeepsnotification", "Simple Beep Notification", getApplicationContext(), Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getApplicationContext().getPackageName() + "/" + R.raw.simplebeepnotification));
        new SimpleNotification().PrepareNotificationChannelWithAudio("alternatingtonesalert", "Alternating Tone Alert", getApplicationContext(), Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getApplicationContext().getPackageName() + "/" + R.raw.alternatingtonealarm));
        new SimpleNotification().PrepareNotificationChannelWithAudio("alternatingtonesnotification", "Alternating Tone Notification", getApplicationContext(), Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getApplicationContext().getPackageName() + "/" + R.raw.alternatingtonenotification));
        new SimpleNotification().PrepareSilentNotificationChannel("silentnotification", "Silent Notifications", getApplicationContext());
        new SimpleNotification().PrepareNotificationChannel("notification", "Forecast Notifications", getApplicationContext());
        new SimpleNotification().PrepareNotificationChannelWithAudio("readynownotification", "ReadyNow Notification", getApplicationContext(), Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/" + R.raw.readynownotification));
        new SimpleNotification().PrepareNotificationChannelWithAudio("readynowalert", "ReadyNow Alert", getApplicationContext(), Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/" + R.raw.readynowalarm));
        new SimpleNotification().PrepareNotificationChannelWithAudio("suremindnotification", "SureMind Notification", getApplicationContext(), Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/" + R.raw.suremindnotification));
        new SimpleNotification().PrepareNotificationChannelWithAudio("suremindalert", "SureMind Alert", getApplicationContext(), Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/" + R.raw.suremindalarm));
        SharedPreferences sharedPreferences = getApplicationContext().getSharedPreferences("NativeStorage", MODE_MULTI_PROCESS);
        //new InformWeather("Severe Thunderstorm Warning", "Springville, St. Clair County, Alabama", "testing", getApplicationContext());
        //new SimpleNotification().NotifyInsistently("I am annoying.", sharedPreferences.getString("settings", "null"), "SimpleBeepAlarm", getApplicationContext(), R.drawable.ic_android_black_24dp, 2);
        // new NWSData().GetAlerts("44.490817", "-103.85937", "North Platte, Lincoln County, Nebraska", this);
        if (sharedPreferences.getBoolean("firstrun", true) || true) {
            sharedPreferences.edit().putBoolean("firstrun", false).commit();
            AlarmManager alarmManager = (AlarmManager) getSystemService(ALARM_SERVICE);
            Intent intentA = new Intent(this, BackgroundService.class);
            PendingIntent pentent = PendingIntent.getBroadcast(this, 1, intentA, 0);
            Calendar c = Calendar.getInstance();
            alarmManager.setExact(AlarmManager.RTC_WAKEUP, c.getTimeInMillis() + 5000, pentent);
        }
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_BACKGROUND_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            Boolean getLocationInBackground = true;
            try {
                JSONObject jObj = new JSONObject(sharedPreferences.getString("settings", ""));
                if (jObj.getJSONObject("location").getBoolean("alerts")){
                    getLocationInBackground = true;
                }
                else{
                    getLocationInBackground = false;
                }
            } catch (Exception e) {

            }
            finally {
                if (getLocationInBackground){
                    ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.ACCESS_BACKGROUND_LOCATION}, 1);
                }
            }

        }


// Request a string response from the provided URL.


// Add the request to the RequestQueue.

    }
}
