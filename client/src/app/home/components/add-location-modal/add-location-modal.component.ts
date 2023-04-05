import { AfterViewInit, Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { SharedModule } from '../../../shared/shared.module';
import { ReminderItemModalComponent } from './components/reminder-item-modal/reminder-item-modal.component';

export enum SelectedUnit{
  km = "km",
  m = "m",
  mil = "mil"
}
@Component({
  selector: 'app-add-location-modal',
  templateUrl: './add-location-modal.component.html',
  styleUrls: ['./add-location-modal.component.scss'],
  standalone: true,
  imports: [SharedModule, ReminderItemModalComponent],
})
export class AddLocationModalComponent implements OnInit {
  selectedUnit: string = "m"; // set default unit to 'm' which is meters
  isAddRemInputOpen: boolean = false;
  isInEditState: boolean = false;
  currentRadiusValue: number = 0;

  constructor(
    private modalController: ModalController
  ) {
    this.selectedUnit = SelectedUnit.m;
   }

  ngOnInit() {
    this.currentRadiusValue = this.getValue();
  }

  returnUnit = (value: number) => {
    this.currentRadiusValue = parseFloat(value.toFixed(1));
    return `${this.currentRadiusValue}${this.selectedUnit}`
  }

  getMax(){
    let retVal;
    switch(this.selectedUnit){
      case SelectedUnit.km:
        retVal = 3;
        break;
      case SelectedUnit.m:
        retVal = 1000;
        break;
      case SelectedUnit.mil:
        retVal = 3;
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
        retVal = 0.5;
        break;
      case SelectedUnit.m:
        retVal = 10;
        break;
      case SelectedUnit.mil:
        retVal = 0.5;
        break;
      default:
        retVal = 0;
        break;
    }
    return retVal;
  }

  getValue(){
    return parseFloat(((this.getMax() + this.getMin()) / 2).toFixed(1));
  }

  getColor(value: string): boolean{
    if(value === this.selectedUnit){
      return true;
    }
    return false;
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
    this.currentRadiusValue = this.getValue();
  }

  async closeModal(){
    await this.modalController.dismiss();
  }

  handleToogleInputs(){
    this.isAddRemInputOpen = !this.isAddRemInputOpen;
  }

  handleEdit(){
    this.isInEditState = true;
  }

  getStep(){
    let retVal;
    switch(this.selectedUnit){
      case SelectedUnit.km:
        retVal = 0.1;
        break;
      case SelectedUnit.m:
        retVal = 10;
        break;
      case SelectedUnit.mil:
        retVal = 0.1;
        break;
      default:
        retVal = 1;
        break;
    }
    return retVal;
  }

  /**
   * THIS METHOD UPDATES currentRadiusValue WHEN DRAGGING THE RANGE. I DON'T KNOW WHY.
   * WELL, IT WORKS SO...
   *  */ 
  updateRadius(e: any){
  
  }
}
