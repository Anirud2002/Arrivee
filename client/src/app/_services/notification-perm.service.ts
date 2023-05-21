import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationPermService {
  private notificationPermStatus: BehaviorSubject<string> = new BehaviorSubject<string>(null); // this will be used in the settings page to toggle/un-toggle the notification
  notificationPermStatus$ = this.notificationPermStatus.asObservable();
  constructor() { }

  async checkPermission(): Promise<string>{
    const permStatus = await LocalNotifications.checkPermissions();
    this.notificationPermStatus.next(permStatus.display);
    return permStatus.display;
  }

  async requestNotificationPermission(){
    const permStatus = await LocalNotifications.requestPermissions();
    this.notificationPermStatus.next(permStatus.display);
  }
}
