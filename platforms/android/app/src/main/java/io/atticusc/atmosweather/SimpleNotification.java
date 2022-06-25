package io.atticusc.atmosweather;

import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.app.TaskStackBuilder;

public class SimpleNotification {
    public SimpleNotification (String notificationTitle, String notificationBody, String notificationChannel, Context context, int smallIcon, int id){
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
    public void SimpleNotificationWithAudio (String notificationTitle, String notificationBody, String notificationChannel, Context context, int smallIcon, int id){
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
}
