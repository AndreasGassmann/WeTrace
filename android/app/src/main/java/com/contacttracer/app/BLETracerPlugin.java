package com.contacttracer.app;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

import ch.papers.contacttracer.AppDatabase;
import ch.papers.contacttracer.models.DeviceContact;

@NativePlugin()
public class BLETracerPlugin extends Plugin {

    @PluginMethod()
    public void getCloseContacts(PluginCall call) {
        long sinceTimestamp = 0;
        try {
            sinceTimestamp = call.getData().getLong("sinceTimestamp");
        } catch (JSONException e) {
            e.printStackTrace();
        }

        List<DeviceContact> closeContacts = AppDatabase.Companion.getDatabase(this.bridge.getContext()).deviceContactDao().getDeviceContactsSince(sinceTimestamp);
        JSArray jsArray = new JSArray();
        JSObject jsObject = new JSObject();

        for (DeviceContact deviceContact : closeContacts) {
            final JSObject deviceContractJSObject = new JSObject();
            deviceContractJSObject.put("deviceId", deviceContact.getDeviceId());
            deviceContractJSObject.put("firstEncountered", deviceContact.getFirstEncountered());
            deviceContractJSObject.put("lastEncountered", deviceContact.getLastEncountered());
            jsArray.put(deviceContractJSObject);
        }

        jsObject.put("result", jsArray);
        call.success(jsObject);
    }

}
