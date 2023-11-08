import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddRestaurantPage } from './add-restaurant.page';

describe('AddRestaurantPage', () => {
  let component: AddRestaurantPage;
  let fixture: ComponentFixture<AddRestaurantPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRestaurantPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddRestaurantPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
