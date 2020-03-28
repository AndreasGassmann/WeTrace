import { TestBed } from '@angular/core/testing';

import { DeviceProximityService } from './device-proximity.service';

describe('DeviceProximityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeviceProximityService = TestBed.get(DeviceProximityService);
    expect(service).toBeTruthy();
  });
});
