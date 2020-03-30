import { Component, ChangeDetectorRef } from '@angular/core';
import { DeviceProximityService } from '../services/device-proximity.service';
import { PushService } from '../services/push.service';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Status } from '../Status';
import { Plugins, Capacitor } from '@capacitor/core';
import { StorageService, StorageKey } from '../services/storage.service';
const { BLETracerPlugin } = Plugins;

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const TIME_TO_CHECK = 14 * DAY;

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
  myReportId = -1;

  constructor(
    private readonly deviceProximityService: DeviceProximityService,
    private readonly storageSerice: StorageService,
    private readonly pushService: PushService,
    private readonly alertController: AlertController,
    private readonly http: HttpClient,
    private readonly cdr: ChangeDetectorRef
  ) {

    setTimeout(() => {
      this.http.get<any>('https://contacttracer.dev.gke.papers.tech/api/v1/reports/').toPromise().then(reports => {
        BLETracerPlugin.getCloseContacts({ sinceTimestamp: new Date().getTime() - TIME_TO_CHECK }).then(response => {
          const unwrappedResponse = response.result.map(i => i.deviceId);
          console.log('unwrappedResponse', unwrappedResponse);
          console.log('reports', reports);
          for (const report of reports) {
            if (unwrappedResponse.indexOf(report.signature.toLowerCase()) > -1) {
              this.myReportId = report.id;
              this.setStatus(Status.POTENTIALLY_INFECTED);
            }
          }
        });
      });
    }, 500); // If we don't have it, it's faster than local storage


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
    console.log('status', status);
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
      header: `You've been tested positive 😷`,
      message:
        'By confirming, you agree that an anonymous message about your result will be sent to our server and other users will be notified. Optionally, you can share some extra information that will help users assess their level of exposure.',
      inputs: [
        {
          name: 'checkbox1',
          type: 'checkbox',
          label: `Share location history`,
          value: 'value1',
          checked: true
        },

        {
          name: 'checkbox2',
          type: 'checkbox',
          label: `Share time of contact`,
          value: 'value2'
        }
      ],
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
      header: `You've been tested negative 🎉`,
      message:
        `Congratulations! By confirming, your status will be switched to healthy again. `,
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
            this.http.delete('https://contacttracer.dev.gke.papers.tech/api/v1/reports/' + this.myReportId + '/').toPromise();
            this.setStatus(Status.HEALTHY);
          }
        }
      ]
    });

    return alert.present();
  }

  public async showIFeelGoodAgainAlert() {
    const alert = await this.alertController.create({
      header: `You've now been showing symptoms for 48 hours 🎉`,
      message:
        `If you have not shown any symptoms for 48 hours and about 2 weeks since your test have passed, you can mark yourself as healthy again.`,
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
