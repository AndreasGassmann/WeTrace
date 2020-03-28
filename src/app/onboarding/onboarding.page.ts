import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { StorageKey, StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements AfterViewInit {
  @ViewChild(IonSlides, { static: true })
  public slides: IonSlides | undefined;

  public isLastPage = false;

  constructor(private readonly router: Router, private readonly storageService: StorageService) { }

  public ngAfterViewInit() {
    if (this.slides) {
      const slides = this.slides;
      slides.ionSlideDidChange.subscribe(async (res: CustomEvent) => {
        this.isLastPage = await slides.isEnd();
      });
    }
  }

  public async slideNext() {
    if (this.slides) {
      if (await this.slides.isEnd()) {
        return this.finish();
      }
      this.slides.slideNext(750, true);
    }
  }

  public async finish() {
    await this.storageService.set(StorageKey.HAS_SHOWN_ONBOARDING, true);
    this.router.navigateByUrl('/');
  }
}
