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

import android.app.Activity;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.ContentResolver;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import org.apache.cordova.*;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;

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
        //System.out.println(getTextFileData("file://Android/data/io.atticusc.atmosweather/files"));
//        new SimpleNotification().PrepareNotificationChannel("banana", "banana", getApplicationContext());
        new SimpleNotification().PrepareNotificationChannel("insist", "insist", getApplicationContext());
//
// new SimpleNotification().NotifyWithAudio("Testing", "This is a test notification.", "banana", getApplicationContext(), R.drawable.ic_android_black_24dp, 1, Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://"+ getApplicationContext().getPackageName() + "/" + R.raw.metronome));
        String PREFS_NAME = preferences.getString("NativeStorageSharedPreferencesName", "NativeStorage");
        SharedPreferences saved = getSharedPreferences(PREFS_NAME, Activity.MODE_PRIVATE);
        new SimpleNotification().NotifyInsistently("I am annoying.", saved.getString("settings", "null"), "insist", getApplicationContext(), R.drawable.ic_android_black_24dp, 2);
    }
    public String getTextFileData(String fileName) {

        StringBuilder text = new StringBuilder();


        try {
            File theFile = new File("data/io.atticusc.atmosweather/atmosweather.txt");
            FileInputStream fIS = new FileInputStream(theFile);
            //FileInputStream fIS = getApplicationContext().openFileInput(fileName);
            InputStreamReader isr = new InputStreamReader(fIS, "UTF-8");
            BufferedReader br = new BufferedReader(isr);

            String line;

            while ((line = br.readLine()) != null) {
                text.append(line + '\n');
            }
            br.close();
        } catch (IOException e) {
            new SimpleNotification().Notify("nope", e.toString(), "insist", getApplicationContext(), R.drawable.ic_android_black_24dp, 1);

        }

        return text.toString();

    }
}
