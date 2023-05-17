import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { Device } from '@capacitor/device';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';

@Component({
  selector: 'app-notification-popover',
  templateUrl: './notification-popover.component.html',
  styleUrls: ['./notification-popover.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class NotificationPopoverComponent  implements OnInit {
  @Input() isNotificationSettingsPopoverOpen: boolean;
  @Output() popoverDismissed: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {}

  async openNativeSettingsApp(){
    const device = await Device.getInfo();
    switch(device.platform){
      case "ios": 
        NativeSettings.openIOS({
          option: IOSSettings.App,
        });
        break;
      case "android": 
        NativeSettings.openAndroid({
          option: AndroidSettings.ApplicationDetails,
        });
        break;
      default:
        // do nothing
        break;
    }
  }

  dismissPopover(){
    this.popoverDismissed.emit(true);
  }

}
