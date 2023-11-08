import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmptyScreenComponent } from './empty-screen.component';

describe('EmptyScreenComponent', () => {
  let component: EmptyScreenComponent;
  let fixture: ComponentFixture<EmptyScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmptyScreenComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
