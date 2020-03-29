package ch.papers.contacttracer

import android.app.AlarmManager
import android.app.PendingIntent
import android.bluetooth.BluetoothManager
import android.bluetooth.le.*
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.ParcelUuid
import android.util.Log
import ch.papers.contacttracer.models.DeviceContact
import com.contacttracer.app.Utils


class BLEAdvertiserBroadcastReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent?) {
        Log.d("ALARM", "onreceive BLEAdvertiserBroadcastReceiver")
        val bluetoothManager =
            context.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager

        bluetoothManager.adapter.enable() // TODO maybe needs user interaction

        val advertiseSettings =
            AdvertiseSettings.Builder().setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY)
                .setConnectable(false).setTxPowerLevel(
                    AdvertiseSettings.ADVERTISE_TX_POWER_HIGH
                ).setTimeout(Utils.ADVERTISEMENT_TIME).build()

        val advertiseData =
            AdvertiseData.Builder().setIncludeTxPowerLevel(true).setIncludeDeviceName(false)
                .addServiceUuid(
                    ParcelUuid.fromString(Utils.getOwnDeviceUUID(context))
                ).build()

        bluetoothManager.adapter.bluetoothLeAdvertiser.startAdvertising(
            advertiseSettings,
            advertiseData,
            object : AdvertiseCallback() {
                override fun onStartSuccess(settingsInEffect: AdvertiseSettings?) {
                    super.onStartSuccess(settingsInEffect)
                    Log.d("ADVERTISE", "success")
                }

                override fun onStartFailure(errorCode: Int) {
                    super.onStartFailure(errorCode)
                    Log.d("ADVERTISE", "errorCode: ${errorCode}")
                }
            })

        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

        val alarmIntent =
            Intent(context, BLEAdvertiserBroadcastReceiver::class.java).let { intent ->
                PendingIntent.getBroadcast(context, 0, intent, 0)
            }
        alarmManager.cancel(alarmIntent)

        Log.d("ALARM", "setting alarm for ${Utils.nextTriggerTimestamp()}")
        alarmManager.set(
            AlarmManager.RTC_WAKEUP,
            Utils.nextTriggerTimestamp(),
            alarmIntent
        )
    }

}