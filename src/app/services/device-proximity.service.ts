import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

interface BluetoothProximityUpdate {
  deviceId: string;
  approxDistance: number;
  publicKey: string;
}

@Injectable({
  providedIn: 'root'
})
export class DeviceProximityService {
  public listeners: ((proximities: BluetoothProximityUpdate[]) => void)[] = [];

  constructor(public readonly storageService: StorageService) {
    const generateDevice = () => {
      return {
        deviceId: 'asdf',
        approxDistance: Math.random() * 5,
        publicKey: 'asdf'
      };
    };

    setInterval(() => {
      const devices = [];
      const time = Math.floor(Math.random() * 5);

      for (let index = 0; index < time; index++) {
        devices.push(generateDevice());
      }

      this.proximityUpdate(devices);
    }, 2000);
  }

  proximityUpdate(proximities: BluetoothProximityUpdate[]) {
    this.listeners.forEach(listener => {
      listener(proximities);
    });
  }
}
