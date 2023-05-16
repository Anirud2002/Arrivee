import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationPermService {
  notificationPermState: string;
  private notificationPermStateUpdated: BehaviorSubject<string> = new BehaviorSubject<string>(null); // this will be used in the settings page to toggle/un-toggle the notification
  constructor() { }

  async checkPermission(): Promise<string>{
    const permStatus = await LocalNotifications.checkPermissions();
    return permStatus.display;
  }

  async requestPermission(){
    const requestPerm = await LocalNotifications.requestPermissions();
    if(requestPerm){
      this.notificationPermState = requestPerm.display;
      this.notificationPermStateUpdated.next(this.notificationPermState);
    }
  }
}
