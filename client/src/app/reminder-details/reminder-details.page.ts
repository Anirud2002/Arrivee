import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { ReminderItemComponent } from './components/reminder-item/reminder-item.component';
import { AddReminderModalComponent } from './components/add-reminder-modal/add-reminder-modal.component';
import { SelectedUnit } from '../home/components/add-location-modal/add-location-modal.component'; 
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LocationService } from '../_services/location.service';
import { Location } from '../_interfaces/Location.modal';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-reminder-details',
  templateUrl: './reminder-details.page.html',
  styleUrls: ['./reminder-details.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [SharedModule, ReminderItemComponent, AddReminderModalComponent]
})
export class ReminderDetailsPage implements OnInit {
  // ADD IT BACK WHEN GOOGLE MAPS IS SUPPORTED FOR arm64 ARCHITECTURE
  // @ViewChild("map") mapRef: ElementRef<HTMLElement>;
  // newMap: GoogleMap;
  location: Location = {} as Location;
  isLoadingData: boolean = false;
  isAddRemInputOpen: boolean = false; // boolean to to store if user wants to create new reminder to not
  locationUpdated: boolean = false; // boolean for location update logic
  newReminderTitle: string = "";
  constructor(
    private locationService: LocationService,
    private actRoute: ActivatedRoute,
  ) { }

  async ngOnInit() {
    this.actRoute.paramMap.subscribe(async params => {
      const id = params.get('id');
      await this.loadLocationDetails(id);
      const {coords:{latitude, longitude}} = this.location;
      // ADD IT BACK WHEN GOOGLE MAPS IS SUPPORTED FOR arm64 ARCHITECTURE
      // await this.renderGoogleMap(latitude, longitude); 
    });
  }

  async loadLocationDetails(locationID: string){
    this.isLoadingData = true;
    this.location = await this.locationService.getLocationDetails(locationID).then(res => {
      this.isLoadingData = false;
      return res;
    });
  }

  // ADD IT BACK WHEN GOOGLE MAPS IS SUPPORTED FOR arm64 ARCHITECTURE
  // async renderGoogleMap(latitude: number, longitude: number){
  //   this.newMap = await GoogleMap.create({
  //     id: uuidv4(),
  //     element: this.mapRef.nativeElement,
  //     apiKey: "AIzaSyDI9zF17bjo0MdmjhG0JlJbQxn3CqgrYDI",
  //     config: {
  //       center: {
  //         lat: latitude,
  //         lng: longitude
  //       },
  //       zoom: 16
  //     },
  //   });

  //   await this.newMap.addMarker({
  //     coordinate: {
  //       lat: latitude,
  //       lng: longitude
  //     }
  //   })
  // }

  returnUnit = (value: number) => {
    this.location.radius = parseFloat(value.toFixed(1));
    return `${this.location.radius}${this.location.radiusUnit}`
  }

  getMax(){
    let retVal: number;
    switch(this.location.radiusUnit){
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
    let retVal: number;
    switch(this.location.radiusUnit){
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
    let retVal: number;
    switch(this.location.radiusUnit){
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

  getDefaultValue(): number{
    return parseFloat(((this.getMax() + this.getMin()) / 2).toFixed(1));

  }

  changeUnit(unit: string){
    switch(unit){
      case "km":
        this.location.radiusUnit = "km";
        break;
      case "m":
        this.location.radiusUnit = "m";
        break;
      case "mil":
        this.location.radiusUnit = "mil";
        break;
      default:
        this.location.radiusUnit = "m";
        break;
    }
    this.location.radius = this.getDefaultValue();
    this.locationUpdated = true;
  }

  handleToggleInputs(){
    this.isAddRemInputOpen = !this.isAddRemInputOpen;
  }

  addNewReminder(){
    if(this.newReminderTitle){
      this.location.reminders.push({title: this.newReminderTitle});
      this.locationUpdated = true;
      this.isAddRemInputOpen = false;
    }
    this.newReminderTitle = "";
  }

  handleRemTitleUpdate(e){
    if(e){
      this.locationUpdated = true;
    }
  }

  handleReminderDelete(e: number){
    let index = e;
    this.location.reminders.splice(index, 1);
    this.locationUpdated = true;
  }

  async handleReminderChecked(e: number){
    let index = e;
    this.location.reminders.splice(index, 1);
    await this.updateLocation();
  }

  async updateLocation(){
    await this.locationService.updateLocation(this.location).then(async () => {
      this.locationUpdated = false;
    });
  }

  /**
   * THIS METHOD UPDATES currentRadiusValue WHEN DRAGGING THE RANGE. I DON'T KNOW WHY.
   * WELL, IT WORKS SO...
   *  */ 
  updateRadius(e: any){
    this.locationUpdated = true;
  }

}
