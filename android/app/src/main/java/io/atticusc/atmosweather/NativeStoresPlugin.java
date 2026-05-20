package io.atticusc.atmosweather;


import android.content.Context;
import android.content.SharedPreferences;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "NativeStores")
public class NativeStoresPlugin extends Plugin {

    @PluginMethod()
    public void setItem(PluginCall call) {
        String key = call.getString("key");
        String value = call.getString("value");

        SharedPreferences store = getContext().getSharedPreferences("NativeStorage", Context.MODE_MULTI_PROCESS);
        store.edit().putString(key, value).apply();
        call.resolve();
    }
}
