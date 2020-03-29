import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Plugins, Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
const { BLETracerPlugin } = Plugins;

class BLETracerPluginMock {
  static getCloseContacts() {
    const generateDevice = (): BluetoothProximityUpdate => {
      return {
        deviceId: Math.random().toString(),
        firstEncountered: Math.random().toString(),
        lastEncountered: Math.random().toString()
      };
    };

    const devices: BluetoothProximityUpdate[] = [];
    const time = Math.floor(Math.random() * 5);

    for (let index = 0; index < time; index++) {
      devices.push(generateDevice());
    }
    return devices;
  }
}

interface BluetoothProximityUpdate {
  deviceId: string;
  firstEncountered: string;
  lastEncountered: string;
}

@Injectable({
  providedIn: 'root'
})
export class DeviceProximityService {
  public listeners: ((proximities: BluetoothProximityUpdate[]) => void)[] = [];

  constructor(public readonly storageService: StorageService, private readonly platform: Platform) {

    setInterval(async () => {
      let result;
      if (Capacitor.isPluginAvailable('BLETracerPlugin')) {
        const contacts = await BLETracerPlugin.getCloseContacts({ sinceTimestamp: new Date().getTime() - 1000 });
        result = contacts.result;
        console.log('BLETracerPlugin result', result);
      } else {
        result = BLETracerPluginMock.getCloseContacts();
        console.log('BLETracerPlugin MOCK result', result);
      }

      this.proximityUpdate(result);
    }, 1000);
  }

  proximityUpdate(proximities: BluetoothProximityUpdate[]) {
    this.listeners.forEach(listener => {
      listener(proximities);
    });
  }
}
