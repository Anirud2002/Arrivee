import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReminderDetailsPage } from './reminder-details.page';

describe('ReminderDetailsPage', () => {
  let component: ReminderDetailsPage;
  let fixture: ComponentFixture<ReminderDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReminderDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
