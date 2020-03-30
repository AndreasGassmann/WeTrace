import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-contact-map',
  templateUrl: './modal-contact-map.page.html',
  styleUrls: ['./modal-contact-map.page.scss'],
})
export class ModalContactMapPage {
  constructor(private readonly modalController: ModalController) { }

  public async dismiss(): Promise<void> {
    await this.modalController.dismiss();
  }

}
