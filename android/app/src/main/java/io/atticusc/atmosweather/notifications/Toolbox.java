package io.atticusc.atmosweather.notifications;

import io.atticusc.atmosweather.R;

public class Toolbox {
    public static int DecideImageFromForecast(String forecast){
        String tempForecast = forecast.toLowerCase();
        int image = R.drawable.sunny;
        if (tempForecast.contains("rain") || tempForecast.contains("storm") || tempForecast.contains("drizzle")){
            image = R.drawable.rainy;
        }
        else if (tempForecast.contains("snow")){
            image = R.drawable.snowy;
        }
        else if (tempForecast.contains("wind")){
            image = R.drawable.windy;
        }
        else if (tempForecast.contains("cloud") || tempForecast.contains("fog")){
            image = R.drawable.cloudy;
        }
        return image;
    }
}
