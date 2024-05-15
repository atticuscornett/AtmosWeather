package io.atticusc.atmosweather;

import android.annotation.SuppressLint;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;

import java.util.Calendar;

import io.atticusc.atmosweather.notifications.NotificationHandler;

public class BootService extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent.getAction().equals(Intent.ACTION_BOOT_COMPLETED)) {
            NotificationHandler.prepareNotificationChannelWithAudio("simplebeepsalert", "Simple Beep Alert", context, Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + context.getPackageName() + "/" + R.raw.simplebeepalarm));
            NotificationHandler.prepareNotificationChannelWithAudio("simplebeepsnotification", "Simple Beep AtmosNotification", context, Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + context.getPackageName() + "/" + R.raw.simplebeepnotification));
            NotificationHandler.prepareNotificationChannelWithAudio("alternatingtonesalert", "Alternating Tone Alert", context, Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + context.getPackageName() + "/" + R.raw.alternatingtonealarm));
            NotificationHandler.prepareNotificationChannelWithAudio("alternatingtonesnotification", "Alternating Tone AtmosNotification", context, Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + context.getPackageName() + "/" + R.raw.alternatingtonenotification));
            NotificationHandler.prepareNotificationChannelWithAudio("readynownotification", "ReadyNow AtmosNotification", context, Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + context.getPackageName() + "/" + R.raw.readynownotification));
            NotificationHandler.prepareNotificationChannelWithAudio("readynowalert", "ReadyNow Alert", context, Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + context.getPackageName() + "/" + R.raw.readynowalarm));
            NotificationHandler.prepareNotificationChannelWithAudio("suremindnotification", "SureMind AtmosNotification", context, Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + context.getPackageName() + "/" + R.raw.suremindnotification));
            NotificationHandler.prepareNotificationChannelWithAudio("suremindalert", "SureMind Alert", context, Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + context.getPackageName() + "/" + R.raw.suremindalarm));
            NotificationHandler.prepareSilentNotificationChannel("silentnotification", "Silent Notifications", context);
            NotificationHandler.prepareNotificationChannel("notification", "Forecast Notifications", context);
            AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
            Intent intentA = new Intent(context, BackgroundService.class);
            PendingIntent pentent = PendingIntent.getBroadcast(context, 1, intentA, PendingIntent.FLAG_IMMUTABLE);
            Calendar c = Calendar.getInstance();
            boolean canScheduleAlarms = true;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                canScheduleAlarms = alarmManager.canScheduleExactAlarms();
            }
            if (canScheduleAlarms){
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, c.getTimeInMillis() + 5000, pentent);
                }
                else {
                    alarmManager.setExact(AlarmManager.RTC_WAKEUP, c.getTimeInMillis() + 5000, pentent);
                }            }
            else {
                alarmManager.set(AlarmManager.RTC_WAKEUP, c.getTimeInMillis() + 5000, pentent);
            }
        }
    }
}
