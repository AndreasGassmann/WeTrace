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
        int sinceTimestamp = call.getInt("sinceTimestamp");

        List<DeviceContact> closeContacts = AppDatabase.Companion.getDatabase(this.bridge.getContext()).deviceContactDao().getDeviceContactsSince(new Long(sinceTimestamp));
        JSArray jsArray = new JSArray();
        JSObject jsObject = new JSObject();
        final JSONArray jsonArray = new JSONArray();
        for (DeviceContact deviceContact : closeContacts) {
            final JSObject deviceContractJSObject = new JSObject();
            deviceContractJSObject.put("deviceId", deviceContact.getDeviceId());
            deviceContractJSObject.put("firstEncountered", deviceContact.getFirstEncountered());
            deviceContractJSObject.put("lastEncountered", deviceContact.getLastEncountered());
            jsArray.put(deviceContractJSObject);
        }

        jsObject.put("result", jsonArray);
        call.success(jsObject);
    }

}
