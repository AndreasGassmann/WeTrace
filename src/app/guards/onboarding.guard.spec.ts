import { TestBed, async, inject } from '@angular/core/testing';

import { OnboardingGuard } from './onboarding.guard';

describe('OnboardingGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OnboardingGuard]
    });
  });

  it('should ...', inject([OnboardingGuard], (guard: OnboardingGuard) => {
    expect(guard).toBeTruthy();
  }));
});
