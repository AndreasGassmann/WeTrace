package com.contacttracer.app

import android.app.PendingIntent
import android.bluetooth.BluetoothManager
import android.bluetooth.le.ScanFilter
import android.bluetooth.le.ScanSettings
import android.content.Context
import android.content.Intent
import android.os.ParcelUuid
import ch.papers.contacttracer.BLEScanResultBroadcastReceiver
import java.util.*


class Utils {

    companion object {
        const val TIME_INTERVAL = 10 * 60 * 1000
        const val SERVICE_UUID_PREFIX = "B6F4"
        const val OWN_DEVICE_UUID_KEY = "OWN_DEVICE_UUID"
        const val ADVERTISEMENT_TIME = 179000

        fun nextTriggerTimestamp(): Long {
            val nowMillis = System.currentTimeMillis()
            val restMillis = nowMillis % TIME_INTERVAL
            return (nowMillis - restMillis) + TIME_INTERVAL
        }

        fun getOwnDeviceUUID(context: Context): String {
            val sharedPreferences = context.getSharedPreferences("default", Context.MODE_PRIVATE)
            var ownDeviceUuid = sharedPreferences.getString(OWN_DEVICE_UUID_KEY, null)

            if (ownDeviceUuid == null) {
                ownDeviceUuid = "${SERVICE_UUID_PREFIX}${UUID.randomUUID().toString().substring(4)}"
                sharedPreferences.edit().putString(OWN_DEVICE_UUID_KEY, ownDeviceUuid).apply()
            }

            return ownDeviceUuid
        }

        fun registerForBLEScanCallback(context: Context) {
            val scanFilter = ScanFilter.Builder().setServiceUuid(ParcelUuid.fromString("${Utils.SERVICE_UUID_PREFIX}0000-0000-0000-0000-000000000000"), ParcelUuid.fromString("FFFF0000-0000-0000-0000-000000000000")).build()
            val scanSettings = ScanSettings.Builder().setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY).setCallbackType(ScanSettings.CALLBACK_TYPE_ALL_MATCHES).setMatchMode(ScanSettings.MATCH_MODE_AGGRESSIVE).setNumOfMatches(ScanSettings.MATCH_NUM_MAX_ADVERTISEMENT).build()
            val bluetoothManager = context.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
            val intent = Intent(context, BLEScanResultBroadcastReceiver::class.java)
            intent.putExtra("o-scan", true)
            val pendingIntent = PendingIntent.getBroadcast(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT)
            bluetoothManager.adapter.bluetoothLeScanner.startScan(listOf(scanFilter), scanSettings, pendingIntent)
        }
    }
}