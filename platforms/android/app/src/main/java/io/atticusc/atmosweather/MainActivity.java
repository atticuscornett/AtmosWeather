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

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.ContentResolver;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.apache.cordova.*;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends CordovaActivity
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
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
        new SimpleNotification().PrepareNotificationChannelWithAudio("simplebeepsalert", "Simple Beep Alert", getApplicationContext(), Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://"+ getApplicationContext().getPackageName() + "/" + R.raw.simplebeepalarm));
        new SimpleNotification().PrepareNotificationChannelWithAudio("simplebeepsnotification", "Simple Beep Notification", getApplicationContext(), Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://"+ getApplicationContext().getPackageName() + "/" + R.raw.simplebeepnotification));
        new SimpleNotification().PrepareNotificationChannelWithAudio("alternatingtonesalert", "Alternating Tone Alert", getApplicationContext(), Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://"+ getApplicationContext().getPackageName() + "/" + R.raw.alternatingtonealarm));
        new SimpleNotification().PrepareNotificationChannelWithAudio("alternatingtonesnotification", "Alternating Tone Notification", getApplicationContext(), Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://"+ getApplicationContext().getPackageName() + "/" + R.raw.alternatingtonenotification));
        new SimpleNotification().PrepareSilentNotificationChannel("silentnotification", "Silent Notifications", getApplicationContext());
        SharedPreferences sharedPreferences = getApplicationContext().getSharedPreferences("NativeStorage", 0);
        //new InformWeather("Severe Thunderstorm Warning", "Springville, St. Clair County, Alabama", "testing", getApplicationContext());
        //new SimpleNotification().NotifyInsistently("I am annoying.", sharedPreferences.getString("settings", "null"), "SimpleBeepAlarm", getApplicationContext(), R.drawable.ic_android_black_24dp, 2);

        new NWSData().GetAlerts("41.1238873", "-100.7654232", "North Platte, Lincoln County, Nebraska", this);

// Request a string response from the provided URL.


// Add the request to the RequestQueue.

    }
}
