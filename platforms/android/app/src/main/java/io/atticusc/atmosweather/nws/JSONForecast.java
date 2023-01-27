package io.atticusc.atmosweather.nws;

import android.content.Context;
import android.content.SharedPreferences;

import androidx.annotation.Nullable;

import com.android.volley.RequestQueue;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class JSONForecast {
    public final static SimpleDateFormat FORMAT = new SimpleDateFormat("dd/MM/yyyy", Locale.US);

    private final String locationName;

    private final JSONObject properties;
    private final JSONObject notifications;
    private final JSONObject localNotifications;

    public JSONForecast(SharedPreferences sharedPreferences, String locationName) throws JSONException {
        this.locationName = locationName;

        final String LOCATION_CACHE_KEY = "locationCache";
        JSONObject locationCache = new JSONObject(sharedPreferences.getString(LOCATION_CACHE_KEY, ""));

        final String PROPERTIES_KEY = "properties";
        properties = locationCache.getJSONObject(PROPERTIES_KEY);

        final String SETTINGS_KEY = "settings";
        JSONObject settings = new JSONObject(sharedPreferences.getString(SETTINGS_KEY, ""));

        final String NOTIFICATIONS_KEY = "notifications";
        notifications = settings.getJSONObject(NOTIFICATIONS_KEY);

        final String LOCATION_SETTINGS_KEY = "per-location";
        JSONObject locationSettings = settings.getJSONObject(LOCATION_SETTINGS_KEY).getJSONObject(locationName);

        final String LOCAL_NOTIFICATIONS_KEY = "notifications";
        localNotifications = locationSettings.getJSONObject(LOCAL_NOTIFICATIONS_KEY);
    }

    @Nullable
    public String getForecastLink() {
        final String FORECAST_LINK_KEY = "forecast";
        try {
            return properties.getString(FORECAST_LINK_KEY);
        } catch (JSONException e) {
            return null;
        }
    }

    public boolean isSevere() {
        return defaultIfNotPresent("severe-future", localNotifications, notifications);
    }

    public boolean isRainy() {
        return defaultIfNotPresent("rain-future", localNotifications, notifications);
    }

    public void attemptNotify(Context context) {
        SharedPreferences sharedPreferences = context.getSharedPreferences("NativeStorage", Context.MODE_MULTI_PROCESS);

        boolean severe = isSevere();
        boolean rain = isRainy();

        RequestQueue queue = Volley.newRequestQueue(context);

        if (!notifiedToday(sharedPreferences)) {
            if (severe || rain) {
                ForecastRequest forecastRequest = new ForecastRequest(getForecastLink(), severe, rain, locationName, context);
                queue.add(forecastRequest);

                System.out.println("Notified user of location \"" + locationName + "\"'s current weather status.");

                sharedPreferences.edit().putString(locationName + "-lastNotif", JSONForecast.FORMAT.format(new Date())).apply();
            }
        }
    }

    private boolean notifiedToday(SharedPreferences sharedPreferences) {
        Date date = new Date();
        String formatted = FORMAT.format(date);

        String lastNotificationDate = sharedPreferences.getString(locationName + "-lastNotif", "");

        return formatted.equals(lastNotificationDate);
    }

    private static boolean defaultIfNotPresent(String key, JSONObject first, JSONObject defaultObject) {
        try {
            return first.getBoolean(key);
        } catch (JSONException ignored) {
            try {
                return defaultObject.getBoolean(key);
            } catch (JSONException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
