package com.contacttracer.app;

import android.content.Intent;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;

import ch.papers.contacttracer.BLEAdvertiserBroadcastReceiver;
import io.stewan.capacitor.fcm.FCMPlugin;


public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Initializes the Bridge
        this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
            // Additional plugins you've installed go here
            // Ex: add(TotallyAwesomePlugin.class);
            add(FCMPlugin.class);
            add(BLETracerPlugin.class);
        }});

        Utils.Companion.registerForBLEScanCallback(this);
        sendBroadcast(new Intent(this, BLEAdvertiserBroadcastReceiver.class));
    }
}
