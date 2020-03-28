import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Plugins, Capacitor } from '@capacitor/core';
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

  constructor(public readonly storageService: StorageService) {

    setInterval(() => {
      let result;
      if (Capacitor.isPluginAvailable('BLETracerPlugin')) {
        result = BLETracerPlugin.getCloseContacts({ sinceTimestamp: new Date().getTime() - 5 * 60 * 1000 });
        console.log('result', result);
      } else {
        result = BLETracerPluginMock.getCloseContacts();
        console.log('mock result', result);
      }

      this.proximityUpdate(result);
    }, 2000);
  }

  proximityUpdate(proximities: BluetoothProximityUpdate[]) {
    this.listeners.forEach(listener => {
      listener(proximities);
    });
  }
}
