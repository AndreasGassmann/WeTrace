import { Injectable } from '@angular/core';
import { Plugins, PushNotification, Capacitor } from '@capacitor/core';
const { PushNotifications, BLETracerPlugin } = Plugins;

// with type support
import { FCM } from 'capacitor-fcm';
import { HttpClient } from '@angular/common/http';
import { Status } from '../Status';
import { Platform } from '@ionic/angular';
const fcm = new FCM();
const { Device } = Plugins;

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const TIME_TO_CHECK = 14 * DAY;

@Injectable({
  providedIn: 'root'
})
export class PushService {
  public listeners: ((status: Status) => void)[] = [];

  constructor(private http: HttpClient, private readonly platform: Platform) {
    // this.register();
  }

  async register() {
    if (this.platform.is('hybrid')) {
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

      PushNotifications.addListener('registration', data => {
        // alert(JSON.stringify(data));
        console.log('registration', data);
      });
      PushNotifications.addListener(
        'pushNotificationReceived',
        (notification: PushNotification) => {
          console.log('notification ' + JSON.stringify(notification));
          BLETracerPlugin.getCloseContacts({ sinceTimestamp: new Date().getTime() - TIME_TO_CHECK }).then(response => {
            console.log('CHECKING', notification.data.signature, response.result);
            if (response.result.map(i => i.deviceId).indexOf(notification.data.signature) > -1) {
              this.changeStatus(Status.POTENTIALLY_INFECTED);
            }
          });
        }
      );
    }

  }

  changeStatus(status: Status) {
    this.listeners.forEach(listener => {
      listener(status);
    });
  }
}
