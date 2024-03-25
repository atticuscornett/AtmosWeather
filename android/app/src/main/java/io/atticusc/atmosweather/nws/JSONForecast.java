package io.atticusc.atmosweather.nws;

import android.content.Context;
import android.content.SharedPreferences;

import androidx.annotation.Nullable;

import com.android.volley.RequestQueue;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class JSONForecast {
    public final static SimpleDateFormat FORMAT = new SimpleDateFormat("dd/MM/yyyy", Locale.US);

    private final String locationName;

    private JSONObject properties;
    private final JSONObject notifications;

    public JSONForecast(SharedPreferences sharedPreferences, String locationName) throws JSONException {
        this.locationName = locationName;

        if (locationName.equals("Current Location")){
            properties = new JSONObject(sharedPreferences.getString("currentLocationProperties", "{}"));
        }
        else{
            final String LOCATION_CACHE_KEY = "location-cache";
            JSONObject locationCache = new JSONObject(sharedPreferences.getString(LOCATION_CACHE_KEY, ""));

            JSONArray locationNames = new JSONArray(sharedPreferences.getString("location-names", "[]"));

            System.out.println(AlertGrabber.createAlertLink(locationCache, locationNames));

            JSONObject locationData = new JSONObject(locationCache.getString(locationName));

            final String PROPERTIES_KEY = "properties";
            properties = locationData.getJSONObject(PROPERTIES_KEY);
        }

        JSONObject settings = determineSettings(sharedPreferences, locationName);

        notifications = determineNotifications(settings);
    }

    /**
     * @param sharedPreferences the data to grab the default settings from
     * @param locationName      the location to get the local notification data for
     * @return either the default global settings, or the local settings for this forecast
     */
    private JSONObject determineSettings(SharedPreferences sharedPreferences, String locationName) throws JSONException {
        final String SETTINGS_KEY = "settings";
        JSONObject settings = new JSONObject(sharedPreferences.getString(SETTINGS_KEY, ""));

        try {
            final String LOCATION_SETTINGS_KEY = "per-location";
            return settings.getJSONObject(LOCATION_SETTINGS_KEY).getJSONObject(locationName);
        } catch (JSONException e) {
            return settings;
        }
    }

    /**
     * @param settings the settings to grab the notification data from
     * @return either the default global notification settings, or the local notification settings for this forecast
     */
    private JSONObject determineNotifications(JSONObject settings) throws JSONException {
        final String NOTIFICATIONS_KEY = "notifications";
        JSONObject notifications = settings.getJSONObject(NOTIFICATIONS_KEY);

        try {
            final String LOCAL_NOTIFICATIONS_KEY = "notifications";
            return notifications.getJSONObject(LOCAL_NOTIFICATIONS_KEY);
        } catch (JSONException e) {
            return notifications;
        }
    }

    /**
     * @return the NWS API link to this forecast
     */
    @Nullable
    public String getForecastLink() {
        final String FORECAST_LINK_KEY = "forecast";
        try {
            if (properties == null){
                return null;
            }
            return properties.getString(FORECAST_LINK_KEY);
        } catch (JSONException e) {
            return null;
        }
    }

    public boolean isSevere() {
        try {
            return notifications.getBoolean("severe-future");
        } catch (JSONException e) {
            return false;
        }
    }

    public boolean isRainy() {
        try {
            return notifications.getBoolean("rain-future");
        } catch (JSONException e) {
            return false;
        }
    }

    /**
     * Sends notification if the user hasn't already been notified of this weather statement.
     *
     * @param context the context of the forecast
     * @see JSONForecast#notifiedToday(SharedPreferences)
     */
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

                // Write the current date to memory so that the user cannot be notified multiple times in one day of the same weather statement.
                sharedPreferences.edit().putString(locationName + "-lastNotif", JSONForecast.FORMAT.format(new Date())).apply();
            }
        }
    }

    /**
     * @param sharedPreferences the shared preferences to check this notification's last send time
     */
    private boolean notifiedToday(SharedPreferences sharedPreferences) {
        Date date = new Date();
        String formatted = FORMAT.format(date);

        String lastNotificationDate = sharedPreferences.getString(locationName + "-lastNotif", "");

        return formatted.equals(lastNotificationDate);
    }
}
