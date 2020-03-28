import { Component } from '@angular/core';
import { DeviceProximityService } from '../services/device-proximity.service';
import { PushService } from '../services/push.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  status = 'bg-warning';
  numberOfClosePeople = 0;

  constructor(private readonly deviceProximityService: DeviceProximityService,
              private readonly pushService: PushService,
              private readonly alertController: AlertController) {
    this.deviceProximityService.listeners.push((proximities) => {
      console.log('proximities', proximities);
      this.numberOfClosePeople = proximities.length;

    });

    this.pushService.listeners.push((infectedPeople) => {
      console.log('infectedPeople', infectedPeople);
      this.status = Math.random() > 0.5 ? 'bg-success' : Math.random() > 0.5 ? 'bg-warning' : 'bg-danger';
    });
  }

  public async showInfectedAlert() {
    const alert = await this.alertController.create({
      header: 'You have been tested positive!',
      message: 'By confirming you agree that an anonymous message about your result will be sent to our server.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    return alert.present();
  }

  public async showIHaveSymptomsAlert() {
    const alert = await this.alertController.create({
      header: 'You are showing symptoms!',
      message: 'Your status will switch yellow, which means you shouldn\'t go out anymore.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    return alert.present();
  }
}
