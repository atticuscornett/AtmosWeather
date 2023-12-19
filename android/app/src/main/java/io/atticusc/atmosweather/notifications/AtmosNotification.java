package io.atticusc.atmosweather.notifications;

import android.app.Notification;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;

import androidx.core.app.NotificationCompat;
import androidx.core.app.TaskStackBuilder;

import io.atticusc.atmosweather.MainActivity;

public class AtmosNotification {
    private final String title;
    private final String body;
    private final String channel;
    private final Context context;
    private final int icon;
    private final Uri soundURI;

    public AtmosNotification(String title, String body, String channel, Context context, int icon, Uri soundURI) {
        this.title = title;
        this.body = body;
        this.channel = channel;
        this.context = context;
        this.icon = icon;
        this.soundURI = soundURI;
    }

    public Notification buildNotification() {
        NotificationCompat.Builder notification = new NotificationCompat.Builder(context, channel);

        Intent intent = new Intent(context, MainActivity.class);

        TaskStackBuilder taskStackBuilder = TaskStackBuilder.create(context);
        taskStackBuilder.addNextIntentWithParentStack(intent);

        PendingIntent pendingIntent = taskStackBuilder.getPendingIntent(0, PendingIntent.FLAG_IMMUTABLE);

        notification
                .setContentIntent(pendingIntent)
                .setContentTitle(title)
                .setContentText(body)
                .setAutoCancel(true)
                .setSmallIcon(icon)
                .setSound(soundURI);

        return notification.build();
    }

    public String getTitle() {
        return title;
    }

    public String getBody() {
        return body;
    }

    public String getChannel() {
        return channel;
    }

    public Context getContext() {
        return context;
    }

    public int getIcon() {
        return icon;
    }

    public Uri getSoundURI() {
        return soundURI;
    }
}
