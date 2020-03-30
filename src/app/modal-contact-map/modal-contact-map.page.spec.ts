import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalContactMapPage } from './modal-contact-map.page';

describe('ModalContactMapPage', () => {
  let component: ModalContactMapPage;
  let fixture: ComponentFixture<ModalContactMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalContactMapPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalContactMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
