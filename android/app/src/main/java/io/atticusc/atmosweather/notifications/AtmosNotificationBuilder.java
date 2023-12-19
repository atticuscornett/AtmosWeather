package io.atticusc.atmosweather.notifications;

import android.content.Context;
import android.net.Uri;

import io.atticusc.atmosweather.R;

public final class AtmosNotificationBuilder {
    private String title;
    private String body;
    private String channel;
    private Context context;
    private int icon;
    private Uri soundURI;

    public AtmosNotificationBuilder(Context context) {
        this.title = "Template AtmosNotification Title";
        this.body = "This is the template notification body!";
        this.context = context;
        this.icon = R.drawable.warning_icon;
        soundURI = null;
    }

    public AtmosNotificationBuilder setTitle(String title) {
        this.title = title;
        return this;
    }

    public AtmosNotificationBuilder setBody(String body) {
        this.body = body;
        return this;
    }

    public AtmosNotificationBuilder setChannel(String channel) {
        this.channel = channel;
        return this;
    }

    public AtmosNotificationBuilder setContext(Context context) {
        this.context = context;
        return this;
    }

    public AtmosNotificationBuilder setIcon(int icon) {
        this.icon = icon;
        return this;
    }

    public AtmosNotification build() {
        return new AtmosNotification(title, body, channel, context, icon, soundURI);
    }

    public void setSoundURI(Uri soundURI) {
        this.soundURI = soundURI;
    }
}
