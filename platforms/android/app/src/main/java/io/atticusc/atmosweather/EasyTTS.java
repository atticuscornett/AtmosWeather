package io.atticusc.atmosweather;

import android.content.Context;
import android.speech.tts.TextToSpeech;

import java.util.Locale;

public class EasyTTS {
    TextToSpeech tts;
    public EasyTTS(String text, Context ctx){
        try {
            tts = new TextToSpeech(ctx, new TextToSpeech.OnInitListener() {
                @Override
                public void onInit(int i) {

                    // if No error is found then only it will run
                    if (i != TextToSpeech.ERROR) {
                        // To Choose language of speech
                        tts.setLanguage(Locale.US);
                        tts.speak(text, TextToSpeech.QUEUE_ADD, null, null);
                    }
                }

            });
        }
        catch (Exception e){
            System.out.println("TTS fail");
        }
    }
}
