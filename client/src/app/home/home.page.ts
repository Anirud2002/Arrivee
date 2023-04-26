import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet, IonicModule, ModalController } from '@ionic/angular';
import { LocationsListComponent } from './components/locations-list/locations-list.component';
import { AddLocationModalComponent } from './components/add-location-modal/add-location-modal.component';
import { SharedModule } from '../shared/shared.module';
import { LocationService } from '../_services/location.service';
import { Location } from '../_interfaces/Location.modal';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [SharedModule, LocationsListComponent, AddLocationModalComponent],
})
export class HomePage implements OnInit {
  locations: Location[] = [];
  constructor(
    private authService: AuthService,
    private locationService: LocationService,
    private modalController: ModalController,
    private outlet: IonRouterOutlet) {}

  ngOnInit(): void {
      this.loadLocations();
      this.subscribeToLocationUpdate();
      this.subscribeToUserUpdates();
  }

  async loadLocations(){
    this.locations = await this.locationService.getLocations();
  }

  subscribeToUserUpdates(){
    this.authService.user$.subscribe(async user => {
      if(user){
        await this.loadLocations();
      }
    })
  }

  subscribeToLocationUpdate(){
    this.locationService.locationUpdated$.subscribe(updated => {
      if(updated){
        this.loadLocations();
      }
    })
  }

  async showAddLocationModal(){
    const modal = await this.modalController.create({
      component: AddLocationModalComponent,
      presentingElement: this.outlet.nativeEl,
      canDismiss: true
    });
    await modal.present();
  } 
}
