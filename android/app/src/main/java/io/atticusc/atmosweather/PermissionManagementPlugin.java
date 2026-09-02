package io.atticusc.atmosweather;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.AlarmManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Typeface;
import android.graphics.fonts.Font;
import android.graphics.fonts.SystemFonts;
import android.net.Uri;
import android.os.Build;
import android.os.PowerManager;
import android.provider.Settings;

import androidx.core.app.ActivityCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;

import java.io.File;
import java.util.ArrayList;
import java.util.Objects;
import java.util.Set;

@CapacitorPlugin(name = "PermissionManagement")
public class PermissionManagementPlugin extends Plugin {

    @PluginMethod()
    public void checkPermissions(PluginCall call) {
        boolean hasLocationPermission = ActivityCompat.checkSelfPermission(this.getContext(), Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED;

        boolean hasBackgroundLocationPermission;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            hasBackgroundLocationPermission = ActivityCompat.checkSelfPermission(this.getContext(), Manifest.permission.ACCESS_BACKGROUND_LOCATION) == PackageManager.PERMISSION_GRANTED;
        } else {
            hasBackgroundLocationPermission = true;
        }

        boolean canScheduleExactAlarms;
        AlarmManager alarmManager = (AlarmManager) getContext().getSystemService(Context.ALARM_SERVICE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            canScheduleExactAlarms = alarmManager.canScheduleExactAlarms();
        }
        else {
            canScheduleExactAlarms = true;
        }

        boolean hasNotificationPermission;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            hasNotificationPermission = ActivityCompat.checkSelfPermission(this.getContext(), Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED;
        }
        else {
            hasNotificationPermission = true;
        }

        boolean hasBatteryOptimizationExemption;
        PowerManager powerManager = (PowerManager) getContext().getSystemService(Context.POWER_SERVICE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            hasBatteryOptimizationExemption = powerManager.isIgnoringBatteryOptimizations(getContext().getPackageName());
        }
        else {
            hasBatteryOptimizationExemption = true;
        }

        JSObject ret = new JSObject();
        ret.put("hasLocationPermission", hasLocationPermission);
        ret.put("hasBackgroundLocationPermission", hasBackgroundLocationPermission);
        ret.put("canScheduleExactAlarms", canScheduleExactAlarms);
        ret.put("hasNotificationPermission", hasNotificationPermission);
        ret.put("hasBatteryOptimizationExemption", hasBatteryOptimizationExemption);

        call.resolve(ret);
    }

    @SuppressLint("BatteryLife")
    @PluginMethod()
    public void requestPermission(PluginCall call){
        String permission = call.getString("permission");
        System.out.println("Permission request: " + permission);

        if (Objects.equals(permission, "background-location")){
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                ActivityCompat.requestPermissions(this.getActivity(), new String[]{Manifest.permission.ACCESS_BACKGROUND_LOCATION}, 1);
            }
            else {
                ActivityCompat.requestPermissions(this.getActivity(), new String[]{Manifest.permission.ACCESS_COARSE_LOCATION}, 1);
            }
        }

        if (Objects.equals(permission, "notifications")){
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                ActivityCompat.requestPermissions(this.getActivity(), new String[]{Manifest.permission.POST_NOTIFICATIONS}, 1);
            }
        }

        if (Objects.equals(permission, "battery-exempt")){
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                System.out.println("lemon");
                Intent intent = new Intent();
                String packageName = getContext().getPackageName();
                intent.setAction(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
                intent.setData(Uri.parse("package:" + packageName));
                getContext().startActivity(intent);
            }
        }

        if (Objects.equals(permission, "exact-alarms")){
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                Intent alarmIntent = new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM);
                getContext().startActivity(alarmIntent);
            }
        }
    }

    @PluginMethod()
    public void requestAvailableFonts(PluginCall call){
        ArrayList<String> fontNames = new ArrayList<>();
        fontNames.add("Default");
        fontNames.add("serif");
        fontNames.add("sans-serif");
        fontNames.add("monospace");
        fontNames.add("cursive");
        fontNames.add("fantasy");

        JSObject ret = new JSObject();
        ret.put("availableFonts", String.join(",", fontNames));
        call.resolve(ret);

        /*
        Do not delete this code yet - it may be used for a future font system. It would have to
        load the fonts by passing them as base64 data to the webview (to get around the face that
        it cannot access the system fonts directly by name).

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {

            System.out.println("Starting thread:");
            new Thread(new Runnable() {
                @Override
                public void run() {
                    // Set<Font> availableFonts = SystemFonts.getAvailableFonts();

                    JSObject ret = new JSObject();
                    ret.put("availableFonts", String.join(",", fontNames));
                    call.resolve(ret);



                    return;


                    for (Font font : availableFonts) {
                        File fontFile = font.getFile();
                        if (fontFile != null) {
                            String fileName = fontFile.getName();
                            // Clean up file name extensions to make valid CSS safe-strings
                            String cleanName = fileName.replace(".ttf", "").replace(".otf", "");

                            if (!fontNames.contains(cleanName)) {
                                fontNames.add(cleanName);
                            }
                        }
                    }

                    System.out.println("Resolving in thread with fonts: " + String.join(",", fontNames));

                    JSObject ret = new JSObject();
                    ret.put("availableFonts", String.join(",", fontNames));
                    call.resolve(ret);


                }
            }).start();
        }
        else {
            System.out.println("Resolving on main with fonts: " + String.join(",", fontNames));

            System.out.println("Available fonts: " + fontNames);


            JSObject ret = new JSObject();
            ret.put("availableFonts", String.join(",", fontNames));
            call.resolve(ret);
        }
        */
    }
}
