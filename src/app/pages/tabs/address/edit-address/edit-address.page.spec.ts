import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditAddressPage } from './edit-address.page';

describe('EditAddressPage', () => {
  let component: EditAddressPage;
  let fixture: ComponentFixture<EditAddressPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAddressPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditAddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
