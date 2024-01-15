package io.atticusc.atmosweather;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.ContentResolver;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;

import androidx.core.app.ActivityCompat;

import com.getcapacitor.BridgeActivity;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Calendar;
import java.util.Map;

import io.atticusc.atmosweather.notifications.NotificationHandler;

public class MainActivity extends BridgeActivity {
    public final static String FIRST_RUN_KEY = "firstrun";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        prepareNotificationChannels();

        SharedPreferences sharedPreferences = getApplicationContext().getSharedPreferences("NativeStorage", MODE_MULTI_PROCESS);

        sharedPreferences.edit().putBoolean(FIRST_RUN_KEY, false).apply();

        // Start the background task timer
        AlarmManager alarmManager = (AlarmManager) getSystemService(ALARM_SERVICE);

        Intent intent = new Intent(getApplicationContext(), BackgroundService.class);

        @SuppressLint("UnspecifiedImmutableFlag")
        PendingIntent pendingIntent = PendingIntent.getBroadcast(getApplicationContext(), 1, intent, PendingIntent.FLAG_IMMUTABLE);

        // Cancel any duplicate alarms
        alarmManager.cancel(pendingIntent);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            if (!alarmManager.canScheduleExactAlarms()){
                Intent alarmIntent = new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM);
                if (intent.resolveActivity(getPackageManager()) != null) {
                    this.startActivity(alarmIntent);
                }
            }
        }

        startBackgroundTask(pendingIntent, 5);



        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_BACKGROUND_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            boolean locationInBackground = getLocationInBackgroundEnabled();

            if (locationInBackground) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                        ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.ACCESS_BACKGROUND_LOCATION, Manifest.permission.POST_NOTIFICATIONS}, 1);
                    }
                    else {
                        ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.ACCESS_BACKGROUND_LOCATION}, 1);
                    }
                }
            }
        }
    }
    private boolean getLocationInBackgroundEnabled() {
        SharedPreferences sharedPreferences = getApplicationContext().getSharedPreferences("NativeStorage", MODE_MULTI_PROCESS);

        try {
            final String SETTINGS_KEY = "settings";
            JSONObject jsonObject = new JSONObject(sharedPreferences.getString(SETTINGS_KEY, ""));

            final String LOCATION_KEY = "location";
            final String ALERTS_KEY = "alerts";

            // Return the setting
            return jsonObject.getJSONObject(LOCATION_KEY).getBoolean(ALERTS_KEY);
        } catch (JSONException ignored) {

            // If there is no setting, return true
            return true;
        }
    }

    private void startBackgroundTask(PendingIntent pendingIntent, int delaySeconds) {
        AlarmManager alarmManager = (AlarmManager) getSystemService(ALARM_SERVICE);

        Calendar calendar = Calendar.getInstance();
        boolean canScheduleAlarms = true;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            canScheduleAlarms = alarmManager.canScheduleExactAlarms();
        }
        if (canScheduleAlarms){
            alarmManager.setExact(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis() + (delaySeconds * 1000L), pendingIntent);
        }
        else {
            alarmManager.set(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis() + (delaySeconds * 1000L), pendingIntent);
        }
    }

    private boolean isFirstRun() {
        SharedPreferences sharedPreferences = getApplicationContext().getSharedPreferences("NativeStorage", MODE_MULTI_PROCESS);

        return sharedPreferences.getBoolean(FIRST_RUN_KEY, true);
    }

    private void prepareNotificationChannels() {
        NotificationHandler.prepareNotificationChannelWithAudio("simplebeepsalert", "Simple Beep Alert", getApplicationContext(), Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getApplicationContext().getPackageName() + "/" + R.raw.simplebeepalarm));
        NotificationHandler.prepareNotificationChannelWithAudio("simplebeepsnotification", "Simple Beep AtmosNotification", getApplicationContext(), Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getApplicationContext().getPackageName() + "/" + R.raw.simplebeepnotification));
        NotificationHandler.prepareNotificationChannelWithAudio("alternatingtonesalert", "Alternating Tone Alert", getApplicationContext(), Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getApplicationContext().getPackageName() + "/" + R.raw.alternatingtonealarm));
        NotificationHandler.prepareNotificationChannelWithAudio("alternatingtonesnotification", "Alternating Tone AtmosNotification", getApplicationContext(), Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getApplicationContext().getPackageName() + "/" + R.raw.alternatingtonenotification));
        NotificationHandler.prepareSilentNotificationChannel("silentnotification", "Silent Notifications", getApplicationContext());
        NotificationHandler.prepareNotificationChannel("notification", "Forecast Notifications", getApplicationContext());
        NotificationHandler.prepareNotificationChannelWithAudio("readynownotification", "ReadyNow AtmosNotification", getApplicationContext(), Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/" + R.raw.readynownotification));
        NotificationHandler.prepareNotificationChannelWithAudio("readynowalert", "ReadyNow Alert", getApplicationContext(), Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/" + R.raw.readynowalarm));
        NotificationHandler.prepareNotificationChannelWithAudio("suremindnotification", "SureMind AtmosNotification", getApplicationContext(), Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/" + R.raw.suremindnotification));
        NotificationHandler.prepareNotificationChannelWithAudio("suremindalert", "SureMind Alert", getApplicationContext(), Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/" + R.raw.suremindalarm));
    }
}
