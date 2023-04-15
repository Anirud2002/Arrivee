import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { ReviewModalComponent } from './components/review-modal/review-modal.component';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-profile',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [SharedModule, ReviewModalComponent]
})
export class SettingsPage implements OnInit {

  constructor(
    private modalController: ModalController,
    private outlet: IonRouterOutlet
  ) { }

  ngOnInit() {
  }

  async openReviewModal(){
    const modal = await this.modalController.create({
      component: ReviewModalComponent,
      presentingElement: this.outlet.nativeEl,
    })

    await modal.present();
  }

  handleLogout(){

  }

}
