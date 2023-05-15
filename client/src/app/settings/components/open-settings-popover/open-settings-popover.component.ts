import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { Device } from '@capacitor/device';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';

@Component({
  selector: 'app-open-settings-popover',
  templateUrl: './open-settings-popover.component.html',
  styleUrls: ['./open-settings-popover.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class OpenSettingsPopoverComponent  implements OnInit {
  @Input() isSettingsPopoverOpen: boolean;
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
