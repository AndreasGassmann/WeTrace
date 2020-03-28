import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PushService {
  public listeners: ((infectedPeople: string[]) => void)[] = [];

  constructor() {
    setInterval(() => {
      this.infectedPeopleNotification([Math.random().toString()]);
    }, 2000);
  }

  infectedPeopleNotification(infectedPeople: string[]) {
    this.listeners.forEach(listener => {
      listener(infectedPeople);
    });
  }
}
