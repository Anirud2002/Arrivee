import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { ReviewModalComponent } from './components/review-modal/review-modal.component';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from '../_services/auth.service';
import { User } from '../_interfaces/Auth.modal';

@Component({
  selector: 'app-profile',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [SharedModule, ReviewModalComponent]
})
export class SettingsPage implements OnInit {
  user: User = {} as User;
  isFetchingData: boolean;
  constructor(
    private authService: AuthService,
    private modalController: ModalController,
    private outlet: IonRouterOutlet
  ) { }

  ngOnInit() {
    this.getUserDetails();
  }

  async getUserDetails(){
    this.isFetchingData = true;
    this.user = await this.authService.getUser().then(res => {
      this.isFetchingData = false;
      return res;
    })
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
