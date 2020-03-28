package ch.papers.contacttracer

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import ch.papers.contacttracer.models.DeviceContact


@Database(entities = [DeviceContact::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun deviceContactDao(): DeviceContactDao?

    companion object {
        private var instance: AppDatabase? = null
        fun getDatabase(appContext: Context?): AppDatabase? {
            if (instance == null) {
                instance = Room.databaseBuilder(
                    appContext as Context,
                    AppDatabase::class.java,
                    "devicecontact-database.db"
                ).build()
            }
            return instance
        }

        fun destroyInstance() {
            instance = null
        }
    }
}