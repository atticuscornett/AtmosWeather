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

        JSObject ret = new JSObject();
        ret.put("value", value);
        ret.put("hasLocationPermission", hasLocationPermission);
        call.resolve(ret);
    }
}
