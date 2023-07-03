import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddLocationModalComponent } from './add-location-modal.component';

describe('AddLocationModalComponent', () => {
  let component: AddLocationModalComponent;
  let fixture: ComponentFixture<AddLocationModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), AddLocationModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AddLocationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
