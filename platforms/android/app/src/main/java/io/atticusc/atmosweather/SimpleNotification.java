package io.atticusc.atmosweather;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.media.AudioAttributes;
import android.net.Uri;
import android.os.Build;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.app.TaskStackBuilder;

import java.util.logging.Logger;

public class SimpleNotification {
    public void Notify (String notificationTitle, String notificationBody, String notificationChannel, Context context, int smallIcon, int id){
        NotificationCompat.Builder notification = new NotificationCompat.Builder(context, notificationChannel);
        Intent intent = new Intent(context, MainActivity.class);
        TaskStackBuilder taskStackBuilder = TaskStackBuilder.create(context);
        taskStackBuilder.addNextIntentWithParentStack(intent);
        PendingIntent pendingIntent = taskStackBuilder.getPendingIntent(0, PendingIntent.FLAG_UPDATE_CURRENT);
        notification.setContentIntent(pendingIntent);
        notification.setContentTitle(notificationTitle);
        notification.setContentText(notificationBody);
        notification.setAutoCancel(true);
        notification.setSmallIcon(smallIcon);
        NotificationManagerCompat notificationManagerCompat = NotificationManagerCompat.from(context);
        notificationManagerCompat.notify(id, notification.build());
    }

    public void NotifyWithAudio(String notificationTitle, String notificationBody, String notificationChannel, Context context, int smallIcon, int id, Uri soundURI){
        Logger.getLogger(SimpleNotification.class.getName()).warning("WARNING - NotifyWithAudio uses depreciated features that may not work on all Android versions.");
        NotificationCompat.Builder notification = new NotificationCompat.Builder(context, notificationChannel);
        Intent intent = new Intent(context, MainActivity.class);
        TaskStackBuilder taskStackBuilder = TaskStackBuilder.create(context);
        taskStackBuilder.addNextIntentWithParentStack(intent);
        PendingIntent pendingIntent = taskStackBuilder.getPendingIntent(0, PendingIntent.FLAG_UPDATE_CURRENT);
        notification.setContentIntent(pendingIntent);
        notification.setContentTitle(notificationTitle);
        notification.setContentText(notificationBody);
        notification.setAutoCancel(true);
        notification.setSmallIcon(smallIcon);
        notification.setSound(soundURI);
        Notification builtNotification = notification.build();
        builtNotification.sound = soundURI;
        NotificationManagerCompat notificationManagerCompat = NotificationManagerCompat.from(context);
        notificationManagerCompat.notify(id, builtNotification);
    }

    public void PrepareNotificationChannel(String channelID, String channelName, Context context){
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O){
            NotificationManager man = context.getSystemService(NotificationManager.class);
            NotificationChannel channel = new NotificationChannel(channelID, channelName, NotificationManager.IMPORTANCE_HIGH);
            man.createNotificationChannel(channel);
        }
    }

    public void PrepareSilentNotificationChannel(String channelID, String channelName, Context context){
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O){
            NotificationManager man = context.getSystemService(NotificationManager.class);
            NotificationChannel channel = new NotificationChannel(channelID, channelName, NotificationManager.IMPORTANCE_LOW);
            man.createNotificationChannel(channel);
        }
    }

    public void PrepareNotificationChannelWithAudio(String channelID, String channelName, Context context, Uri audioUri){
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O){
            NotificationManager man = context.getSystemService(NotificationManager.class);
            NotificationChannel channel = new NotificationChannel(channelID, channelName, NotificationManager.IMPORTANCE_HIGH);
            AudioAttributes audioAttributes = new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_ALARM).build();
            channel.setSound(audioUri, audioAttributes);
            channel.enableLights(true);
            channel.enableVibration(true);
            man.createNotificationChannel(channel);
        }
    }

    public void NotifyInsistently (String notificationTitle, String notificationBody, String notificationChannel, Context context, int smallIcon, int id){
        NotificationCompat.Builder notification = new NotificationCompat.Builder(context, notificationChannel);
        Intent intent = new Intent(context, MainActivity.class);
        TaskStackBuilder taskStackBuilder = TaskStackBuilder.create(context);
        taskStackBuilder.addNextIntentWithParentStack(intent);
        PendingIntent pendingIntent = taskStackBuilder.getPendingIntent(0, PendingIntent.FLAG_UPDATE_CURRENT);
        notification.setContentIntent(pendingIntent);
        notification.setContentTitle(notificationTitle);
        notification.setContentText(notificationBody);
        notification.setAutoCancel(true);
        notification.setSmallIcon(smallIcon);
        Notification buildNotification = notification.build();
        buildNotification.flags |= NotificationCompat.FLAG_INSISTENT;
        NotificationManagerCompat notificationManagerCompat = NotificationManagerCompat.from(context);
        notificationManagerCompat.notify(id, buildNotification);
    }
}