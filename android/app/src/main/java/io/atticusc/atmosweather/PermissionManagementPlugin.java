package io.atticusc.atmosweather;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.AlarmManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
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

import java.util.Objects;

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
}
