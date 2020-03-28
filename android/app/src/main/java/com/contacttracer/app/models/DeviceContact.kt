package ch.papers.contacttracer.models

import android.database.MatrixCursor
import android.net.Uri
import android.provider.DocumentsContract
import android.webkit.MimeTypeMap
import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "deviceContact")
data class DeviceContact(
    @PrimaryKey val deviceId: String,
    var firstEncountered: Long,
    var lastEncountered: Long
) {

}
