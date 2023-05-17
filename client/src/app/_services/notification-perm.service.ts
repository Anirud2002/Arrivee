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

  async requestPermission(){
    const requestPerm = await LocalNotifications.requestPermissions();
    if(requestPerm){
      this.notificationPermState = requestPerm.display;
      this.notificationPermStateUpdated.next(this.notificationPermState);

      if(this.notificationPermState === "granted"){
        await this.userConfigService.setNotificationStatus("granted");
      } else if(this.notificationPermState === "denied"){
        await this.userConfigService.setNotificationStatus("denied");
      }
    }
  }
}
