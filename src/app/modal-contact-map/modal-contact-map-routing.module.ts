import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalContactMapPage } from './modal-contact-map.page';

const routes: Routes = [
  {
    path: '',
    component: ModalContactMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalContactMapPageRoutingModule {}
