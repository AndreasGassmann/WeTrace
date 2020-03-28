import { Injectable } from '@angular/core';
// import { Plugins, PushNotification } from '@capacitor/core';
// const { PushNotifications } = Plugins;

// // with type support
// import { FCM } from 'capacitor-fcm';
// const fcm = new FCM();

@Injectable({
  providedIn: 'root'
})
export class PushService {
  public listeners: ((infectedPeople: string[]) => void)[] = [];

  constructor() {
    // PushNotifications.register()
    //   .then(() => {
    //     //
    //     // Subscribe to a specific topic
    //     // you can use `FCMPlugin` or just `fcm`
    //     fcm
    //       .subscribeTo({ topic: 'test' })
    //       .then(r => alert(`subscribed to topic`))
    //       .catch(err => console.log(err));
    //   })
    //   .catch(err => alert(JSON.stringify(err)));

    // // Get FCM token instead the APN one returned by Capacitor
    // fcm
    //   .getToken()
    //   .then(r => alert(`Token ${r.token}`))
    //   .catch(err => console.log(err));

    // setInterval(() => {
    //   this.infectedPeopleNotification([Math.random().toString()]);
    // }, 2000);
  }

  register() {
    // PushNotifications.addListener('registration', data => {
    //   // alert(JSON.stringify(data));
    //   console.log('registration', data);
    // });
    // PushNotifications.register().then(() => alert(`registered for push`));
    // PushNotifications.addListener(
    //   'pushNotificationReceived',
    //   (notification: PushNotification) => {
    //     console.log('notification ' + JSON.stringify(notification));
    //   }
    // );
  }

  infectedPeopleNotification(infectedPeople: string[]) {
    this.listeners.forEach(listener => {
      listener(infectedPeople);
    });
  }
}
