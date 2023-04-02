import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonRouterOutlet, IonicModule, ModalController } from '@ionic/angular';
import { ReminderItemComponent } from './components/reminder-item/reminder-item.component';
import { AddReminderModalComponent } from './components/add-reminder-modal/add-reminder-modal.component';

@Component({
  selector: 'app-reminder-details',
  templateUrl: './reminder-details.page.html',
  styleUrls: ['./reminder-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReminderItemComponent, AddReminderModalComponent]
})
export class ReminderDetailsPage implements OnInit {

  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() {
  }

  async openAddReminderModal(){
    const modal = await this.modalController.create({
      component: AddReminderModalComponent,
      breakpoints: [0, 0.25, 0.75],
      initialBreakpoint: 0.25,
    })

    await modal.present();
  }

}
