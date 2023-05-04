import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LocationsListSkeletonComponent } from './locations-list-skeleton.component';

describe('LocationsListSkeletonComponent', () => {
  let component: LocationsListSkeletonComponent;
  let fixture: ComponentFixture<LocationsListSkeletonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationsListSkeletonComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationsListSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
