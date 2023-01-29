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
import android.annotation.SuppressLint;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.ContentResolver;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;

import androidx.core.app.ActivityCompat;

import org.apache.cordova.CordovaActivity;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Calendar;

import io.atticusc.atmosweather.notifications.NotificationHandler;

public class MainActivity extends CordovaActivity {
    public final static String FIRST_RUN_KEY = "firstrun";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // enable Cordova apps to be started in the background
        Bundle extras = getIntent().getExtras();
        if (extras != null && extras.getBoolean("cdvStartInBackground", false)) {
            moveTaskToBack(true);
        }

        // Load the index.html file from cordova
        loadUrl(launchUrl);

        prepareNotificationChannels();

        SharedPreferences sharedPreferences = getApplicationContext().getSharedPreferences("NativeStorage", MODE_MULTI_PROCESS);

        if (isFirstRun()) {
            // Make sure this doesn't get run again
            sharedPreferences.edit().putBoolean(FIRST_RUN_KEY, false).apply();

            Intent intent = new Intent(this, BackgroundService.class);

            @SuppressLint("UnspecifiedImmutableFlag")
            PendingIntent pendingIntent = PendingIntent.getBroadcast(this, 1, intent, 0);

            startBackgroundTask(pendingIntent, 5);
        }

        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_BACKGROUND_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            boolean locationInBackground = getLocationInBackgroundEnabled();

            if (locationInBackground) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.ACCESS_BACKGROUND_LOCATION}, 1);
                }
            }
        }
    }

    private boolean getLocationInBackgroundEnabled() {
        SharedPreferences sharedPreferences = getApplicationContext().getSharedPreferences("NativeStorage", MODE_MULTI_PROCESS);

        try {
            final String SETTINGS_KEY = "settings";
            JSONObject jsonObject = new JSONObject(sharedPreferences.getString(SETTINGS_KEY, ""));

            final String LOCATION_KEY = "location";
            final String ALERTS_KEY = "alerts";

            // Return the setting
            return jsonObject.getJSONObject(LOCATION_KEY).getBoolean(ALERTS_KEY);
        } catch (JSONException ignored) {

            // If there is no setting, return true
            return true;
        }
    }

    private void startBackgroundTask(PendingIntent pendingIntent, int delaySeconds) {
        AlarmManager alarmManager = (AlarmManager) getSystemService(ALARM_SERVICE);

        Calendar calendar = Calendar.getInstance();
        alarmManager.setExact(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis() + (delaySeconds * 1000L), pendingIntent);
    }

    private boolean isFirstRun() {
        SharedPreferences sharedPreferences = getApplicationContext().getSharedPreferences("NativeStorage", MODE_MULTI_PROCESS);

        return sharedPreferences.getBoolean(FIRST_RUN_KEY, true);
    }

    private void prepareNotificationChannels() {
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
    }
}
