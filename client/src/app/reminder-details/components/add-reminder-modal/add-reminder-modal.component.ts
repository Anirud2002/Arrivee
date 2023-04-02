import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-reminder-modal',
  templateUrl: './add-reminder-modal.component.html',
  styleUrls: ['./add-reminder-modal.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class AddReminderModalComponent  implements OnInit {

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  async closeModal(){
    await this.modalController.dismiss();
  }

}
