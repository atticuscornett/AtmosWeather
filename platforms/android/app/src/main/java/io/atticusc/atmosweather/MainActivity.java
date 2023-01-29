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
import android.app.PendingIntent;
import android.content.ContentResolver;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;

import androidx.core.app.ActivityCompat;

import org.apache.cordova.CordovaActivity;
import org.json.JSONObject;

import java.util.Calendar;

import io.atticusc.atmosweather.notifications.NotificationHandler;

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
//        new NotificationHandler().prepareNotificationChannel("banana", "banana", getApplicationContext());
//        new NotificationHandler().prepareNotificationChannel("insist", "insist", getApplicationContext());
//        new NotificationHandler().notifyWithAudio("Testing", "This is a test notification.", "banana", getApplicationContext(), R.drawable.ic_android_black_24dp, 1, Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://"+ getApplicationContext().getPackageName() + "/" + R.raw.metronome));
        NotificationHandler.prepareNotificationChannelWithAudio("simplebeepsalert", "Simple Beep Alert", getApplicationContext(), Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getApplicationContext().getPackageName() + "/" + R.raw.simplebeepalarm));
        NotificationHandler.prepareNotificationChannelWithAudio("simplebeepsnotification", "Simple Beep AtmosNotification", getApplicationContext(), Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getApplicationContext().getPackageName() + "/" + R.raw.simplebeepnotification));
        NotificationHandler.prepareNotificationChannelWithAudio("alternatingtonesalert", "Alternating Tone Alert", getApplicationContext(), Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getApplicationContext().getPackageName() + "/" + R.raw.alternatingtonealarm));
        NotificationHandler.prepareNotificationChannelWithAudio("alternatingtonesnotification", "Alternating Tone AtmosNotification", getApplicationContext(), Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getApplicationContext().getPackageName() + "/" + R.raw.alternatingtonenotification));
        NotificationHandler.prepareSilentNotificationChannel("silentnotification", "Silent Notifications", getApplicationContext());
        NotificationHandler.prepareNotificationChannel("notification", "Forecast Notifications", getApplicationContext());
        NotificationHandler.prepareNotificationChannelWithAudio("readynownotification", "ReadyNow AtmosNotification", getApplicationContext(), Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/" + R.raw.readynownotification));
        NotificationHandler.prepareNotificationChannelWithAudio("readynowalert", "ReadyNow Alert", getApplicationContext(), Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/" + R.raw.readynowalarm));
        NotificationHandler.prepareNotificationChannelWithAudio("suremindnotification", "SureMind AtmosNotification", getApplicationContext(), Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/" + R.raw.suremindnotification));
        NotificationHandler.prepareNotificationChannelWithAudio("suremindalert", "SureMind Alert", getApplicationContext(), Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/" + R.raw.suremindalarm));
        SharedPreferences sharedPreferences = getApplicationContext().getSharedPreferences("NativeStorage", MODE_MULTI_PROCESS);
        //new InformWeather("Severe Thunderstorm Warning", "Springville, St. Clair County, Alabama", "testing", getApplicationContext());
        //new NotificationHandler().notifyInsistently("I am annoying.", sharedPreferences.getString("settings", "null"), "SimpleBeepAlarm", getApplicationContext(), R.drawable.ic_android_black_24dp, 2);
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
                getLocationInBackground = jObj.getJSONObject("location").getBoolean("alerts");
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
