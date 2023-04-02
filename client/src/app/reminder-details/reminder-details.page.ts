import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonRouterOutlet, IonicModule, ModalController } from '@ionic/angular';
import { ReminderItemComponent } from './components/reminder-item/reminder-item.component';
import { AddReminderModalComponent } from './components/add-reminder-modal/add-reminder-modal.component';
import { SelectedUnit } from '../home/add-location-modal/add-location-modal.component';

@Component({
  selector: 'app-reminder-details',
  templateUrl: './reminder-details.page.html',
  styleUrls: ['./reminder-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReminderItemComponent, AddReminderModalComponent]
})
export class ReminderDetailsPage implements OnInit {
  selectedUnit: string = "m"; // set default unit to 'm' which is meters
  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() {
  }

  async openAddReminderModal(){
    const modal = await this.modalController.create({
      component: AddReminderModalComponent,
      breakpoints: [0, 0.6],
      initialBreakpoint: 0.6,
    })

    await modal.present();
  }

  returnUnit = (value: number) => {
    return `${value}${this.selectedUnit}`
  }

  getMax(){
    let retVal;
    switch(this.selectedUnit){
      case SelectedUnit.km:
        retVal = 5;
        break;
      case SelectedUnit.m:
        retVal = 1000;
        break;
      case SelectedUnit.mil:
        retVal = 5;
        break;
      default:
        retVal = 0;
        break;
    }
    return retVal;
  }

  getMin(){
    let retVal;
    switch(this.selectedUnit){
      case SelectedUnit.km:
        retVal = 1;
        break;
      case SelectedUnit.m:
        retVal = 10;
        break;
      case SelectedUnit.mil:
        retVal = 1;
        break;
      default:
        retVal = 0;
        break;
    }
    return retVal;
  }

  getValue(){
    return (this.getMax() + this.getMin()) / 2;
  }

  changeUnit(unit: string){
    switch(unit){
      case "km":
        this.selectedUnit = "km";
        break;
      case "m":
        this.selectedUnit = "m";
        break;
      case "mil":
        this.selectedUnit = "mil";
        break;
      default:
        this.selectedUnit = "m";
        break;
    }
  }

}
