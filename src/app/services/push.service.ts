import { Injectable } from '@angular/core';
import { Plugins, PushNotification } from '@capacitor/core';
const { PushNotifications } = Plugins;

// with type support
import { FCM } from 'capacitor-fcm';
import { HttpClient } from '@angular/common/http';
const fcm = new FCM();
const { Device } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PushService {
  public listeners: ((infectedPeople: string[]) => void)[] = [];

  constructor(private http: HttpClient) {
    // this.register();
  }

  async register() {
    PushNotifications.register()
      .then(() => {
        //
        // Subscribe to a specific topic
        // you can use `FCMPlugin` or just `fcm`
        fcm
          .subscribeTo({ topic: 'new_infections' })
          .then(r => console.log(`subscribed to topic "new_infections"`, r))
          .catch(err => console.log(err));
      })
      .catch(err => alert(JSON.stringify(err)));

    const info = await Device.getInfo();
    fcm
      .getToken()
      .then(response => {
        this.http.post('https://contacttracer.dev.gke.papers.tech/api/v1/fcm/', {
          active: true,
          type: info.platform,
          registration_id: response.token
        }).subscribe(res => console.log(res));
      }
      )
      .catch(err => console.log(err));

    setInterval(() => {
      this.infectedPeopleNotification([Math.random().toString()]);
    }, 2000);

    PushNotifications.addListener('registration', data => {
      // alert(JSON.stringify(data));
      console.log('registration', data);
    });
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotification) => {
        console.log('notification ' + JSON.stringify(notification));
      }
    );
  }

  infectedPeopleNotification(infectedPeople: string[]) {
    this.listeners.forEach(listener => {
      listener(infectedPeople);
    });
  }
}
