import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-review-modal',
  templateUrl: './review-modal.component.html',
  styleUrls: ['./review-modal.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class ReviewModalComponent  implements OnInit {
  currentRating: number = 0;
  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  setRating(rating: number){
    this.currentRating = rating;
  }

  handleSendFeedback(){

  }

  async closeModal(){
    await this.modalController.dismiss();
  }

}
