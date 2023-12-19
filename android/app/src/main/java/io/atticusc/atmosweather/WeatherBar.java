package io.atticusc.atmosweather;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

import androidx.core.content.res.ResourcesCompat;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;

import io.atticusc.atmosweather.notifications.Toolbox;

/**
 * Implementation of App Widget functionality.
 */
public class WeatherBar extends AppWidgetProvider {

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager,
                                int appWidgetId) throws JSONException {

        SharedPreferences sharedPreferences = context.getSharedPreferences("NativeStorage", Context.MODE_MULTI_PROCESS);
        JSONObject currentLocationProps = new JSONObject(sharedPreferences.getString("currentLocationProperties", "{}"));
        if (currentLocationProps.length() != 0){
            System.out.println(currentLocationProps);
            currentLocationProps.getString("forecast");

            // Instantiate the RequestQueue.
            RequestQueue queue = Volley.newRequestQueue(context);
            String url = currentLocationProps.getString("forecast") + "/hourly";

            // Request a string response from the provided URL.
            StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                    new Response.Listener<String>() {
                        @Override
                        public void onResponse(String response) {
                            try {
                                JSONObject forecastResponse = new JSONObject(response);
                                JSONObject currentPeriod = forecastResponse.getJSONObject("properties").getJSONArray("periods").getJSONObject(0);
                                int temp = currentPeriod.getInt("temperature");
                                String shortForecast = currentPeriod.getString("shortForecast");
                                //CharSequence widgetText = new SimpleDateFormat("HH:mm").format(new java.util.Date());
                                CharSequence tempText = temp + " °F";
                                // Construct the RemoteViews object
                                RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.weather_bar);
                                views.setTextViewText(R.id.lastUpdatedText, shortForecast);
                                views.setTextViewText(R.id.currentTempWidget, tempText);
                                views.setImageViewResource(R.id.widgetWeatherIcon, Toolbox.DecideImageFromForecast(shortForecast));

                                // Instruct the widget manager to update the widget
                                appWidgetManager.updateAppWidget(appWidgetId, views);
                            } catch (JSONException e) {
                                throw new RuntimeException(e);
                            }
                        }
                    }, null) {
                @Override
                public Map<String, String> getHeaders(){
                    Map<String, String> headers = new HashMap<>();
                    headers.put("User-agent", "Atmos Weather Widget Service");
                    return headers;
                }
            };
            queue.add(stringRequest);
        }
        System.out.println("hey good news this works");
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        // There may be multiple widgets active, so update all of them
        for (int appWidgetId : appWidgetIds) {
            try {
                updateAppWidget(context, appWidgetManager, appWidgetId);
            } catch (JSONException e) {
                throw new RuntimeException(e);
            }
        }
    }

    @Override
    public void onEnabled(Context context) {
        // Enter relevant functionality for when the first widget is created
    }

    @Override
    public void onDisabled(Context context) {
        // Enter relevant functionality for when the last widget is disabled
    }
}