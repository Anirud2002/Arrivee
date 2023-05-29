import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ModalController } from '@ionic/angular';
import { FeedbackService } from '../../../_services/feedback.service';

@Component({
  selector: 'app-review-modal',
  templateUrl: './review-modal.component.html',
  styleUrls: ['./review-modal.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class ReviewModalComponent  implements OnInit {
  feedback: string;
  currentRating: number = 0;
  constructor(
    private feedbackService: FeedbackService,
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  setRating(rating: number){
    this.currentRating = rating;
  }

  async handleSendFeedback(){
    const success = await this.feedbackService.sendFeedback(this.feedback, this.currentRating);
    if(!success){
      return; // do nothing
    }
    // else
    this.currentRating = 0;
    this.feedback = "";
    this.modalController.dismiss();
  }

  async closeModal(){
    await this.modalController.dismiss();
  }

}
