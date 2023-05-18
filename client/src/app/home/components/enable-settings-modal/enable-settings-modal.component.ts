import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { AndroidSettings, IOSSettings, NativeSettings,  } from 'capacitor-native-settings';
import { Device } from '@capacitor/device';

@Component({
  selector: 'app-enable-settings-modal',
  templateUrl: './enable-settings-modal.component.html',
  styleUrls: ['./enable-settings-modal.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class EnableSettingsModalComponent  implements OnInit {
  @Input() data: any;
  type: "location" | "notification";
  constructor() { }

  ngOnInit() {
    this.type = this.data.type;
  }

  async openSettings(){
    const device = await Device.getInfo();
    switch(device.platform){
      case "ios":
        NativeSettings.openIOS({
          option: IOSSettings.App
        });
        break;
      case "android":
        NativeSettings.openAndroid({
          option: AndroidSettings.ApplicationDetails
        });
        break;
      default:
        console.log("Only works natively bro!");
        break;
    }
  }

}
