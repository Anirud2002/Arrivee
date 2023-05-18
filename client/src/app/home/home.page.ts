import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet, IonicModule, ModalController } from '@ionic/angular';
import { LocationsListComponent } from './components/locations-list/locations-list.component';
import { AddLocationModalComponent } from './components/add-location-modal/add-location-modal.component';
import { SharedModule } from '../shared/shared.module';
import { LocationService } from '../_services/location.service';
import { Location } from '../_interfaces/Location.modal';
import { AuthService } from '../_services/auth.service';
import { LocationsListSkeletonComponent } from './components/locations-list-skeleton/locations-list-skeleton.component';
import { LocationPermService } from '../_services/location-perm.service';
import { UserConfigService } from '../_services/user-config.service';
import { NotificationPermService } from '../_services/notification-perm.service';
import { EnableSettingsModalComponent } from './components/enable-settings-modal/enable-settings-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [SharedModule, LocationsListComponent, AddLocationModalComponent, LocationsListSkeletonComponent, EnableSettingsModalComponent],
})
export class HomePage implements OnInit {
  isFetchingData: boolean = false;
  locations: Location[] = [];
  constructor(
    private authService: AuthService,
    private locationService: LocationService,
    private userConfigService: UserConfigService,
    private modalController: ModalController,
    private locationPermService: LocationPermService,
    private notificationPermService: NotificationPermService,
    private outlet: IonRouterOutlet) {}

  async ngOnInit() {
    this.loadLocations();
    this.subscribeToLocationUpdate();
    this.subscribeToUserUpdates();
    await this.checkAndRequestLocationPermission();
    await this.checkAndRequestNotificationPermission();
  }

  async loadLocations(){
    this.isFetchingData = true;
    this.locations = await this.locationService.getLocations().then((res) => {
      this.isFetchingData = false;
      return res;
    });
  }

  async checkAndRequestLocationPermission(){
    const locationPermState = await this.locationPermService.checkPermission();
    if(!locationPermState || locationPermState === "denied"){
      return;
    }
    
    if(locationPermState === "prompt"){
      await this.locationPermService.requestLocationPermission();
    } else if (locationPermState === "denied") {
      await this.presentEnableModal("location");
    }
  }

  async presentEnableModal(type: "location" | "notification"){
    const modal = await this.modalController.create({
      component: EnableSettingsModalComponent,
      initialBreakpoint: 0.3,
      componentProps: {
        data: {
          type
        }
      }
    });
    await modal.present();
  }

  async checkAndRequestNotificationPermission(){
    const notificationPermState = await this.notificationPermService.checkPermission();
    if(!notificationPermState || notificationPermState === "denied"){
      return;
    }

    if(notificationPermState === "prompt"){
      await this.notificationPermService.requestNotificationPermission();
    } else if (notificationPermState === "denied") {
      await this.presentEnableModal("notification");
    }
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
