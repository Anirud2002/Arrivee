import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() type: "location" | "notification";
  @Input() shouldOpen: boolean;
  @Output() modalDismissed: EventEmitter<"location" | "notification"> = new EventEmitter<"location" | "notification">(null);
  constructor() { }

  ngOnInit() {
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

    this.dismiss();
  }

  dismiss(){
    if(this.type === "location"){
      this.modalDismissed.emit("location");
    }else {
      this.modalDismissed.emit("notification");
    }
  }

}
