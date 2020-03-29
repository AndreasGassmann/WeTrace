import { Component } from '@angular/core';
import { DeviceProximityService } from '../services/device-proximity.service';
import { PushService } from '../services/push.service';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

enum Status {
  HEALTHY = 'healthy',
  POTENTIALLY_INFECTED = 'symptoms',
  INFECTED = 'infected'
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  status: Status = Status.HEALTHY;
  statusClass = 'bg-success';
  statusTitle = 'Negative';
  statusDescription = 'test';
  numberOfClosePeople = 0;

  constructor(private readonly deviceProximityService: DeviceProximityService,
    private readonly pushService: PushService,
    private readonly alertController: AlertController,
    private readonly http: HttpClient) {
    this.deviceProximityService.listeners.push((proximities) => {
      console.log('proximities', proximities);
      this.numberOfClosePeople = proximities.length;

    });

    this.setStatus(Status.INFECTED);

    this.pushService.listeners.push((infectedPeople) => {
      console.log('infectedPeople', infectedPeople);
      Math.random() > 0.5 ?
        this.setStatus(Status.HEALTHY) :
        Math.random() > 0.5 ?
          this.setStatus(Status.POTENTIALLY_INFECTED) :
          this.setStatus(Status.INFECTED);
    });
  }

  public async setStatus(status: Status) {
    switch (status) {
      case Status.HEALTHY:
        this.statusClass = 'bg-success';
        this.statusTitle = `You're healthy! 😊`;
        this.statusDescription = 'You have not had any close contact with a confirmed Covid-19 case.';
        // Button 1 = I tested positive

        break;

      case Status.POTENTIALLY_INFECTED:
        this.statusClass = 'bg-warning';
        this.statusTitle = `You're potentially infected with Covid-19`;
        this.statusDescription =
          `You've had a close contact with a confirmed Covid-19 case.<br />Please monitor your symptoms and self-isolate for <strong>x more days</strong>. After this period, you will be considered healthy again.`;
        // Add countdown
        // Button 1 = I tested positive
        // Button 2 = I tested negative

        break;

      case Status.INFECTED:
        this.statusClass = 'bg-danger';
        this.statusTitle = `You are a confirmed Covid-19 case`;
        this.statusDescription = `We wish you a speedy recovery. Please self isolate to protect your loved ones and others.`;
        /// Button 1 = I feel great again (no symptoms for 48 hours)

        break;

      default:

        break;
    }
  }

  public async showIAmInfectedAlert() {
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
            this.http.post('https://contacttracer.dev.gke.papers.tech/api/v1/reports/', {
              signature: Math.random().toString(),
              severity: 2
            }).subscribe(res => console.log(res));
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
