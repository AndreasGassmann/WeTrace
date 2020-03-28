import { Component } from '@angular/core';
import { DeviceProximityService } from '../services/device-proximity.service';
import { PushService } from '../services/push.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  status = 'bg-warning';
  numberOfClosePeople = 0;

  constructor(private readonly deviceProximityService: DeviceProximityService, private readonly pushService: PushService) {
    this.deviceProximityService.listeners.push((proximities) => {
      console.log('proximities', proximities);
      this.numberOfClosePeople = proximities.length;

    });

    this.pushService.listeners.push((infectedPeople) => {
      console.log('infectedPeople', infectedPeople);
      this.status = Math.random() > 0.5 ? 'bg-success' : Math.random() > 0.5 ? 'bg-warning' : 'bg-danger';
    });
  }

}
