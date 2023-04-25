import { Component } from '@angular/core';
import { IonicModule, isPlatform } from '@ionic/angular';
import { SharedModule } from './shared/shared.module';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, SharedModule],
})
export class AppComponent {
  constructor() {
    this.initializeApp();
  }

  initializeApp(){
    if(!isPlatform("capacitor")){
      GoogleAuth.initialize({
        clientId: '711358070411-ibpj1lvqushopekhog1pkga4t30fv242.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      })
    }
  }
}
