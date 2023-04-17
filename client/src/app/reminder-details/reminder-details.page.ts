import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ReminderItemComponent } from './components/reminder-item/reminder-item.component';
import { AddReminderModalComponent } from './components/add-reminder-modal/add-reminder-modal.component';
import { SelectedUnit } from '../home/components/add-location-modal/add-location-modal.component'; 
import { ActivatedRoute } from '@angular/router';
import { LocationService } from '../_services/location.service';
import { Location } from '../_interfaces/Location.modal';

@Component({
  selector: 'app-reminder-details',
  templateUrl: './reminder-details.page.html',
  styleUrls: ['./reminder-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReminderItemComponent, AddReminderModalComponent]
})
export class ReminderDetailsPage implements OnInit {
  location: Location;
  isLoadingData: boolean = false;
  selectedUnit: string = "m"; // set default unit to 'm' which is meters
  isAddRemInputOpen: boolean = false; // boolean to to store if user wants to create new reminder to not
  isAddingNewReminder: boolean = false; // boolean to store current state if user is adding rem or not
  currentRadiusValue: number = 0;
  constructor(
    private locationService: LocationService,
    private modalController: ModalController,
    private actRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    let locationID = this.actRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      this.loadLocationDetails(id);
    })
  }

  async loadLocationDetails(locationID: string){
    this.isLoadingData = true;
    this.location = await this.locationService.getLocationDetails(locationID);
    if(this.location){
      this.isLoadingData = false;
      this.changeUnit(this.location.radiusUnit);
    }

    if(!this.location){
      this.isLoadingData = false;
    }
    console.log(this.location);
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

  getValue(): number{
    console.log(this.location.radius)
    return this.location.radius
    return parseFloat(((this.getMax() + this.getMin()) / 2).toFixed(1));

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

  handleToogleInputs(){
    this.isAddRemInputOpen = !this.isAddRemInputOpen;
  }

  enableSaveButton(){
    this.isAddingNewReminder = true;
  }

  /**
   * THIS METHOD UPDATES currentRadiusValue WHEN DRAGGING THE RANGE. I DON'T KNOW WHY.
   * WELL, IT WORKS SO...
   *  */ 
  updateRadius(e: any){
  
  }

}
