package io.atticusc.atmosweather;

import android.Manifest;
import android.app.AlarmManager;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.PowerManager;

import androidx.core.app.ActivityCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;

@CapacitorPlugin(name = "PermissionManagement")
public class PermissionManagementPlugin extends Plugin {

    @PluginMethod()
    public void checkPermissions(PluginCall call) {
        String value = call.getString("value");

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
}
