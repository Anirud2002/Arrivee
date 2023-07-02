import { Component } from '@angular/core';
import { IonicModule, Platform, isPlatform } from '@ionic/angular';
import { SharedModule } from './shared/shared.module';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { UserConfigService } from './_services/user-config.service';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, SharedModule],
})
export class AppComponent {
  constructor(
    private userConfigService: UserConfigService,
    private platform: Platform
  ) {
    SplashScreen.show();
    this.initializeApp();
  }

  initializeApp(){
    if(!isPlatform("capacitor")){
      GoogleAuth.initialize({
        clientId: '711358070411-ibpj1lvqushopekhog1pkga4t30fv242.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });
    }
    this.platform.ready().then(() => {
      SplashScreen.hide();
    })
    this.userConfigService.applyThemeOnInit();
  }
}
