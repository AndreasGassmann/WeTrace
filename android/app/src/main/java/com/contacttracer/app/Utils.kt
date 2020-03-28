package com.contacttracer.app

import android.content.Context
import java.util.*

object Utils {
    const val TIME_INTERVAL = 30 * 1000
    const val SERVICE_UUID_PREFIX = "B6F4"
    const val OWN_DEVICE_UUID_KEY = "OWN_DEVICE_UUID"
    const val ADVERTISEMENT_TIME= 15000

    fun nextTriggerTimestamp(): Long {
        val restMillis = System.currentTimeMillis() % TIME_INTERVAL
        return (System.currentTimeMillis() - restMillis) + TIME_INTERVAL
    }

    fun getOwnDeviceUUID(context: Context): String{
        val sharedPreferences = context.getSharedPreferences("default",Context.MODE_PRIVATE)
        var ownDeviceUuid = sharedPreferences.getString(OWN_DEVICE_UUID_KEY,null)

        if(ownDeviceUuid==null){
            ownDeviceUuid = "${SERVICE_UUID_PREFIX}${UUID.randomUUID().toString().substring(4)}"
            sharedPreferences.edit().putString(OWN_DEVICE_UUID_KEY, ownDeviceUuid).apply()
        }

        return ownDeviceUuid
    }
}