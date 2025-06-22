package io.atticusc.atmosweather.notifications;

import android.Manifest;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.pm.PackageManager;
import android.media.AudioAttributes;
import android.net.Uri;
import android.os.Build;

import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import java.util.logging.Logger;

public class NotificationHandler {
    public NotificationHandler() {
        throw new IllegalStateException("NotificationHandler class should not be instantiated, as it is a utility class.");
    }

    /**
     * Send notification to user
     *
     * @param id           the id of the notification to be sent
     * @param notification the content info of the notification
     */
    public static void notify(int id, AtmosNotification notification) {
        NotificationManagerCompat notificationManagerCompat = NotificationManagerCompat.from(notification.getContext());

        if (ActivityCompat.checkSelfPermission(notification.getContext(), Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            return;
        }
        notificationManagerCompat.notify(id, notification.buildNotification());
    }

    /**
     * Send notification to user and play a sound
     *
     * @param id           the id of the notification to be sent
     * @param notification the content info of the notification
     * @see NotificationHandler#notify(int, AtmosNotification)
     */
    public static void notifyWithAudio(int id, AtmosNotification notification) {
        Logger.getLogger(NotificationHandler.class.getName()).warning("WARNING - notifyWithAudio uses depreciated features that may not work on all Android versions.");

        Notification builtNotification = notification.buildNotification();

        builtNotification.sound = notification.getSoundURI();
        NotificationManagerCompat notificationManagerCompat = NotificationManagerCompat.from(notification.getContext());

        notificationManagerCompat.notify(id, builtNotification);
    }

    /**
     * Send notification to the user that buzzes until cleared
     *
     * @param id                the id of the notification to be sent
     * @param atmosNotification the content info of the notification
     * @see NotificationHandler#notify(int, AtmosNotification)
     */
    public static void notifyInsistently(int id, AtmosNotification atmosNotification) {
        Notification notification = atmosNotification.buildNotification();

        // Make the notification impossible to clear
        notification.flags |= NotificationCompat.FLAG_INSISTENT;

        NotificationManagerCompat notificationManagerCompat = NotificationManagerCompat.from(atmosNotification.getContext());
        notificationManagerCompat.notify(id, notification);
    }

    /**
     * @param channelID   the id of the channel to be used later
     * @param channelName the name of the notification channel
     * @param context     the context for this event
     */
    public static void prepareNotificationChannel(String channelID, String channelName, Context context) {
        // Make sure that the version of android is recent enough to support this
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager man = context.getSystemService(NotificationManager.class);

            NotificationChannel channel = new NotificationChannel(channelID, channelName, NotificationManager.IMPORTANCE_HIGH);
            man.createNotificationChannel(channel);
        }
    }

    /**
     * Prepares a notification channel that does not send audio
     *
     * @param channelID   the id of the channel to be used later
     * @param channelName the name of the notification channel
     * @param context     the context for this event
     */
    public static void prepareSilentNotificationChannel(String channelID, String channelName, Context context) {
        // Make sure that the version of android is recent enough to support this
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager man = context.getSystemService(NotificationManager.class);

            NotificationChannel channel = new NotificationChannel(channelID, channelName, NotificationManager.IMPORTANCE_LOW);
            man.createNotificationChannel(channel);
        }
    }

    /**
     * Prepares a notification channel that sends audio
     *
     * @param channelID   the id of the channel to be used later
     * @param channelName the name of the notification channel
     * @param context     the context for this event
     * @param audioUri    the sound to play
     */
    public static void prepareNotificationChannelWithAudio(String channelID, String channelName, Context context, Uri audioUri) {
        // Make sure that the version of android is recent enough to support this
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager man = context.getSystemService(NotificationManager.class);
            NotificationChannel channel = new NotificationChannel(channelID, channelName, NotificationManager.IMPORTANCE_HIGH);

            AudioAttributes audioAttributes = new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_ALARM).build();
            channel.setSound(audioUri, audioAttributes);
            channel.enableLights(true);
            channel.enableVibration(true);

            man.createNotificationChannel(channel);
        }
    }

}