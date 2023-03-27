package io.atticusc.atmosweather;

import android.content.SharedPreferences;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

import java.util.Map;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        SharedPreferences test = getApplicationContext().getSharedPreferences("NativeStorage", MODE_MULTI_PROCESS);
        System.out.println(test.getString("Cheese", "bean"));
    }
}
