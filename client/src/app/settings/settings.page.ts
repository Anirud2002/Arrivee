import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { ReviewModalComponent } from './components/review-modal/review-modal.component';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from '../_services/auth.service';
import { User } from '../_interfaces/Auth.modal';
import { UserConfigService } from '../_services/user-config.service';

@Component({
  selector: 'app-profile',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [SharedModule, ReviewModalComponent]
})
export class SettingsPage implements OnInit {
  theme: string;
  user: User = {} as User;
  isFetchingData: boolean;
  constructor(
    private authService: AuthService,
    private userConfigService: UserConfigService,
    private modalController: ModalController,
    private outlet: IonRouterOutlet
  ) { }

  ngOnInit() {
    this.getUserDetails();
    this.getTheme();
    this.subscribeToUserUpdates()
  }

  async getUserDetails(){
    this.isFetchingData = true;
    this.user = await this.authService.getUser().then(res => {
      this.isFetchingData = false;
      return res;
    })
  }

  subscribeToUserUpdates(){
    this.authService.user$.subscribe(user => {
      if(user){
        this.getUserDetails();
      }
    })
  }

  async getTheme(){
    this.theme = await this.userConfigService.getTheme();
  }

  handleThemeChange(e){
    const theme = e.detail.value;
    this.userConfigService.applyTheme(theme);
  }

  async openReviewModal(){
    const modal = await this.modalController.create({
      component: ReviewModalComponent,
      presentingElement: this.outlet.nativeEl,
    })

    await modal.present();
  }

  async handleLogout(){
     await this.authService.logout();
  }

}
