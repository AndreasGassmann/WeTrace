import { Component, ChangeDetectorRef } from '@angular/core';
import { DeviceProximityService } from '../services/device-proximity.service';
import { PushService } from '../services/push.service';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Status } from '../Status';
import { Plugins, Capacitor } from '@capacitor/core';
import { StorageService, StorageKey } from '../services/storage.service';
const { BLETracerPlugin } = Plugins;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  status: Status = Status.HEALTHY;
  statusClass = 'bg-light';
  statusTitle = '';
  statusDescription = '';
  statusAction: Array<{ text: string; action: () => void }>;
  recommendationTitle = '';
  recommendationDescription = '';
  recommendationImage = '';
  numberOfClosePeople = 0;

  constructor(
    private readonly deviceProximityService: DeviceProximityService,
    private readonly storageSerice: StorageService,
    private readonly pushService: PushService,
    private readonly alertController: AlertController,
    private readonly http: HttpClient,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.deviceProximityService.listeners.push(proximities => {
      console.log('Proximities length', proximities.length);
      this.numberOfClosePeople = proximities.length;
      this.cdr.detectChanges();
    });

    this.storageSerice.get(StorageKey.COVID_STATUS).then(status => {
      this.setStatus(status);
    });

    this.pushService.listeners.push(status => {
      console.log('current status is /', this.status, status);
      if (this.status === Status.INFECTED) {
        return;
      } else {
        this.setStatus(status);
      }
    });
  }

  public async setStatus(status: Status) {
    switch (status) {
      case Status.HEALTHY:
        this.status = Status.HEALTHY;
        this.storageSerice.set(StorageKey.COVID_STATUS, Status.HEALTHY);

        this.statusClass = 'bg-success';
        this.statusTitle = `You're healthy! 😊`;
        this.statusDescription =
          'You have not had any close contact with a confirmed Covid-19 case.';
        this.recommendationTitle = 'Practice Social Distancing';
        this.recommendationDescription =
          'To be safe you should practice social distancing and stay away at least 2m from others.';
        this.recommendationImage = '/assets/img/we_trace_distance.svg';
        this.statusAction = [
          {
            text: 'I tested positive',
            action: () => {
              this.showITestedPositiveAlert();
            }
          }
        ];

        break;

      case Status.POTENTIALLY_INFECTED:
        this.status = Status.POTENTIALLY_INFECTED;
        this.storageSerice.set(StorageKey.COVID_STATUS, Status.POTENTIALLY_INFECTED);

        this.statusClass = 'bg-warning';
        this.statusTitle = `You're potentially infected with Covid-19 😷`;
        this.statusDescription = `You have had a close contact with a confirmed Covid-19 case.`;
        this.recommendationTitle = 'Quarantine';
        this.recommendationDescription =
          'Please monitor your symptoms and self-isolate for 14 more days. After this period, you will be considered healthy again.';
        this.recommendationImage = '/assets/img/we_trace_quarantaine.svg';
        this.statusAction = [
          {
            text: 'I tested positive',
            action: () => {
              this.showITestedPositiveAlert();
            }
          },
          {
            text: 'I tested negative',
            action: () => {
              this.showITestedNegativeAlert();
            }
          }
        ];
        // Add countdown

        break;

      case Status.INFECTED:
        this.status = Status.INFECTED;
        this.storageSerice.set(StorageKey.COVID_STATUS, Status.INFECTED);

        this.statusClass = 'bg-danger';
        this.statusTitle = `You are a confirmed Covid-19 case 🤒`;
        this.statusDescription = `You have been tested positive for Covid-19 by a doctor.`;
        this.recommendationTitle = 'Quarantine';
        this.recommendationDescription =
          'We wish you a speedy recovery. Please monitor your symptoms and stay in quarantaine as longs as you\'ve been advised by your doctor.';
        this.recommendationImage = '/assets/img/we_trace_quarantaine.svg';
        this.statusAction = [
          {
            text: 'I had no symptoms for 48 hours',
            action: () => {
              this.showIFeelGoodAgainAlert();
            }
          }
        ];

        break;

      default:
        break;
    }
  }

  public async showITestedPositiveAlert() {
    const alert = await this.alertController.create({
      header: 'You have been tested positive!',
      message:
        'By confirming you agree that an anonymous message about your result will be sent to our server.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        },
        {
          text: 'Yes',
          handler: async () => {
            this.setStatus(Status.INFECTED);
            this.http
              .post(
                'https://contacttracer.dev.gke.papers.tech/api/v1/reports/',
                {
                  signature: (await BLETracerPlugin.getOwnDeviceUUID()).result,
                  severity: 2
                }
              )
              .subscribe(res => {
                console.log(res);
              });
          }
        }
      ]
    });

    return alert.present();
  }

  public async showITestedNegativeAlert() {
    const alert = await this.alertController.create({
      header: 'You have been tested positive!',
      message:
        'By confirming you agree that an anonymous message about your result will be sent to our server.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.setStatus(Status.HEALTHY);
          }
        }
      ]
    });

    return alert.present();
  }

  public async showIFeelGoodAgainAlert() {
    const alert = await this.alertController.create({
      header: 'You are showing symptoms!',
      message:
        'Your status will switch yellow, which means you shouldn\'t go out anymore.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Okay');
            this.setStatus(Status.HEALTHY);
          }
        }
      ]
    });

    return alert.present();
  }
}
