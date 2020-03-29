import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Subject } from 'rxjs';
import { Status } from '../Status';

export enum StorageKey {
  HAS_SHOWN_ONBOARDING = 'HAS_SHOWN_ONBOARDING',
  COVID_STATUS = 'COVID_STATUS',
}

interface StorageKeyReturnType {
  [StorageKey.HAS_SHOWN_ONBOARDING]: boolean;
  [StorageKey.COVID_STATUS]: Status;
}

type StorageKeyReturnDefaults = { [key in StorageKey]: StorageKeyReturnType[key] };

const defaultValues: StorageKeyReturnDefaults = {
  [StorageKey.HAS_SHOWN_ONBOARDING]: false,
  [StorageKey.COVID_STATUS]: Status.HEALTHY
};

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  storageChanged: Subject<void> = new Subject();

  constructor(private readonly storage: Storage) { }

  public async get<K extends StorageKey>(key: K): Promise<StorageKeyReturnType[K]> {
    const value: StorageKeyReturnType[K] = (await this.storage.get(key)) || defaultValues[key];
    console.log(`[SETTINGS_SERVICE:get] ${key}, returned: ${value}`);

    return value;
  }

  public async set<K extends StorageKey>(key: K, value: StorageKeyReturnType[K]): Promise<any> {
    console.log(`[SETTINGS_SERVICE:set] ${key}, ${value}`);

    const storageReturnValue = await this.storage.set(key, value);

    this.storageChanged.next();

    return storageReturnValue;
  }

  public async delete<K extends StorageKey>(key: K): Promise<boolean> {
    try {
      await this.storage.remove(key);

      this.storageChanged.next();

      return true;
    } catch (error) {
      return false;
    }
  }
}
