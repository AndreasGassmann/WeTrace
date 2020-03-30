import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalContactMapPageRoutingModule } from './modal-contact-map-routing.module';

import { ModalContactMapPage } from './modal-contact-map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalContactMapPageRoutingModule
  ],
  declarations: [ModalContactMapPage]
})
export class ModalContactMapPageModule {}
