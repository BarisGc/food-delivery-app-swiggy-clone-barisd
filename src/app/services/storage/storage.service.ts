import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  setStorage(key, value) {
    Preferences.set({key: key, value: value});
  }

  getStorage(key) {
    return Preferences.get({key: key});
  }

  removeStorage(key) {
    Preferences.remove({key: key});
  }

  clearStorage() {
    Preferences.clear();
  }
}
