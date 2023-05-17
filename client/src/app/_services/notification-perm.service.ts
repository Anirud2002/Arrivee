import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { BehaviorSubject } from 'rxjs';
import { UserConfigService } from './user-config.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationPermService {
  notificationPermState: string;
  private notificationPermStateUpdated: BehaviorSubject<string> = new BehaviorSubject<string>(null); // this will be used in the settings page to toggle/un-toggle the notification
  notificationPermStateUpdated$ = this.notificationPermStateUpdated.asObservable();
  constructor(
    private userConfigService: UserConfigService
  ) { }

  async checkPermission(): Promise<string>{
    const permStatus = await LocalNotifications.checkPermissions();
    return permStatus.display;
  }

  async requestNotificationPermission(){
    await LocalNotifications.requestPermissions();
  }
}
