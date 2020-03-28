import { TestBed } from '@angular/core/testing';

import { PushService } from './push.service';

describe('PushService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PushService = TestBed.get(PushService);
    expect(service).toBeTruthy();
  });
});
