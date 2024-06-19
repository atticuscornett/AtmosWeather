package io.atticusc.atmosweather;

import android.Manifest;
import android.content.pm.PackageManager;

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
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
            hasBackgroundLocationPermission = ActivityCompat.checkSelfPermission(this.getContext(), Manifest.permission.ACCESS_BACKGROUND_LOCATION) == PackageManager.PERMISSION_GRANTED;
        } else {
            hasBackgroundLocationPermission = true;
        }

        JSObject ret = new JSObject();
        ret.put("hasLocationPermission", hasLocationPermission);
        ret.put("hasBackgroundLocationPermission", hasBackgroundLocationPermission);
        call.resolve(ret);
    }
}
