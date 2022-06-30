package io.atticusc.atmosweather;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;

import java.util.Calendar;

public class BootService extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent.getAction().equals(Intent.ACTION_BOOT_COMPLETED)){
            new SimpleNotification().PrepareNotificationChannelWithAudio("simplebeepsnotification", "Simple Beep Notification", context, Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://"+ context.getPackageName() + "/" + R.raw.simplebeepnotification));
            new SimpleNotification().NotifyInsistently("I am annoying.", "annoy", "simplebeepsnotification", context, R.drawable.ic_android_black_24dp, 2);
            AlarmManager alarmManager = (AlarmManager) context.getSystemService(context.ALARM_SERVICE);
            Intent intentA = new Intent(context, BackgroundService.class);
            PendingIntent pentent = PendingIntent.getBroadcast(context, 1, intentA, 0);
            Calendar c = Calendar.getInstance();
            alarmManager.setExact(AlarmManager.RTC_WAKEUP, c.getTimeInMillis() + 5000, pentent);
        }
    }
}
