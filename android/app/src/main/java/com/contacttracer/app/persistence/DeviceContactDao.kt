package ch.papers.contacttracer

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy.REPLACE
import androidx.room.Query
import ch.papers.contacttracer.models.DeviceContact


@Dao
interface DeviceContactDao {
    @Insert(onConflict = REPLACE)
    fun inserts(deviceContacts: List<DeviceContact?>?)

    @Insert(onConflict = REPLACE)
    fun insertDeviceContact(deviceContact: DeviceContact?)

    @Query("select * from deviceContact")
    fun getAllDeviceContacts(): List<DeviceContact?>?

    @Query("select * from deviceContact where deviceId = :deviceId")
    fun getDeviceContactById(deviceId: String?): DeviceContact?

    @Query("select * from deviceContact where lastEncountered >= :sinceTimestamp")
    fun getDeviceContactsSince(sinceTimestamp: Long?): List<DeviceContact>?
}