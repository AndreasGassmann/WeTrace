import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService, StorageKey } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class OnboardingGuard implements CanActivate {
  constructor(private readonly router: Router, private readonly settingsService: StorageService) {
  }

  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }

  public async canActivate(): Promise<boolean> {
    const hasOnboarded = await this.settingsService.get(StorageKey.HAS_SHOWN_ONBOARDING);

    if (hasOnboarded) {
      return true;
    }

    this.router.navigateByUrl(`onboarding`);
    return false;
  }
}
