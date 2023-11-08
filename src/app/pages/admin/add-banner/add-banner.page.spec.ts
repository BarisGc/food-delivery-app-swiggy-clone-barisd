import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddBannerPage } from './add-banner.page';

describe('AddBannerPage', () => {
  let component: AddBannerPage;
  let fixture: ComponentFixture<AddBannerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBannerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddBannerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
