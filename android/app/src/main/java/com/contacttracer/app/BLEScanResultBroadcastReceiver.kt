package ch.papers.contacttracer

import android.bluetooth.le.*
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import ch.papers.contacttracer.models.DeviceContact
import com.contacttracer.app.Utils


class BLEScanResultBroadcastReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        Log.d("ALARM", "onreceive BLEScanResultBroadcastReceiver")
        val bleCallbackType = intent.getIntExtra(BluetoothLeScanner.EXTRA_CALLBACK_TYPE, -1)
        if (bleCallbackType != -1) {
            val deviceContactDao = AppDatabase.getDatabase(context)?.deviceContactDao()
            val scanResults: ArrayList<ScanResult> = intent.getParcelableArrayListExtra(
                    BluetoothLeScanner.EXTRA_LIST_SCAN_RESULT)
            for (scanResult in scanResults) {
                Thread {
                    val deviceId = scanResult.scanRecord.serviceUuids.first().uuid.toString()
                    if (deviceId != null && deviceId.toUpperCase()
                                    .startsWith(Utils.SERVICE_UUID_PREFIX)
                    ) {
                        var deviceContact = deviceContactDao?.getDeviceContactById(deviceId)
                        if (deviceContact == null) {
                            deviceContact = DeviceContact(
                                    deviceId,
                                    System.currentTimeMillis(),
                                    System.currentTimeMillis()
                            )
                        } else {
                            deviceContact.lastEncountered = System.currentTimeMillis()
                        }
                        Log.d("INSERT", "inserting")
                        deviceContactDao?.insertDeviceContact(deviceContact)
                    }
                }.start()
            }
        }
    }
}