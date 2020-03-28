import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

export enum StorageKey {
  HAS_SHOWN_ONBOARDING = 'HAS_SHOWN_ONBOARDING',
}

interface StorageKeyReturnType {
  [StorageKey.HAS_SHOWN_ONBOARDING]: boolean;
}

type StorageKeyReturnDefaults = { [key in StorageKey]: StorageKeyReturnType[key] };

const defaultValues: StorageKeyReturnDefaults = {
  [StorageKey.HAS_SHOWN_ONBOARDING]: false
};

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private readonly storage: Storage) { }

  public async get<K extends StorageKey>(key: K): Promise<StorageKeyReturnType[K]> {
    const value: StorageKeyReturnType[K] = (await this.storage.get(key)) || defaultValues[key];
    console.log(`[SETTINGS_SERVICE:get] ${key}, returned: ${value}`);

    return value;
  }

  public async set<K extends StorageKey>(key: K, value: StorageKeyReturnType[K]): Promise<any> {
    console.log(`[SETTINGS_SERVICE:set] ${key}, ${value}`);

    return this.storage.set(key, value);
  }

  public async delete<K extends StorageKey>(key: K): Promise<boolean> {
    try {
      await this.storage.remove(key);

      return true;
    } catch (error) {
      return false;
    }
  }
}
