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
import { NotificationPermService } from '../_services/notification-perm.service';
import { EnableSettingsModalComponent } from './components/enable-settings-modal/enable-settings-modal.component';
import { App } from '@capacitor/app';
import { LocationNotificationService } from '../_services/location-notification.service';
import { Preferences } from '@capacitor/preferences';
import { UserConfigService } from '../_services/user-config.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [SharedModule, LocationsListComponent, AddLocationModalComponent, LocationsListSkeletonComponent, EnableSettingsModalComponent],
})
export class HomePage implements OnInit {
  isFetchingData: boolean = false;
  showLocationEnableSettingsModal: boolean = false;
  showNotificationEnableSettingsModal: boolean = false;
  enableTrackingToggle: boolean = false;
  locations: Location[] = [];
  constructor(
    private authService: AuthService,
    private locationService: LocationService,
    private modalController: ModalController,
    private userConfigService: UserConfigService,
    private locationPermService: LocationPermService,
    private notificationPermService: NotificationPermService,
    private locationNotificationService: LocationNotificationService,
    private outlet: IonRouterOutlet) { }

  async ngOnInit() {
    this.loadLocations();
    this.subscribeToLocationUpdate();
    this.subscribeToUserUpdates();
    this.subsribeToEnableTrackingToggle();
    this.locationNotificationService.subscribeToEnableTrackingToggle();
    this.locationNotificationService.subscribeToLocationPermStatus();
    this.locationNotificationService.subscribeToNotificationPermStatus();
    this.checkAndRequestLocationPermission();
    this.checkAndRequestNotificationPermission();
    this.listenForAppStateChange();
  }

  async loadLocations(){
    this.isFetchingData = true;
    this.locations = await this.locationService.getLocations().then((res) => {
      this.isFetchingData = false;
      return res;
    });
  }

  listenForAppStateChange(){
    App.addListener('appStateChange', ({ isActive }) => {
      if(isActive){
        this.checkAndRequestLocationPermission();
        this.checkAndRequestNotificationPermission();
      } else {
        this.locationNotificationService.watchUsersLocationOnBackground();
      }
    });
  }

  async checkAndRequestLocationPermission(){
    const locationPermState = await this.locationPermService.checkPermission();
    
    if(locationPermState === "prompt"){
      this.locationPermService.requestLocationPermission();
    } else if (locationPermState === "denied") {
      this.showLocationEnableSettingsModal = true;
    }
  }

  
  async checkAndRequestNotificationPermission(){
    const notificationPermState = await this.notificationPermService.checkPermission();
    
    if(notificationPermState === "prompt"){
      this.notificationPermService.requestNotificationPermission();
    } else if (notificationPermState === "denied") {
      this.showNotificationEnableSettingsModal = true;
    }
  }

  handleEnableLocation(e){
    this.userConfigService.setEnableTrackingValue(e.detail.checked, this.locationNotificationService.locationPermStatus);
  }

  subscribeToLocationPermStatus(){
    this.locationPermService.locationPermStatus$.subscribe(async status => {
      const {value} = await Preferences.get({key: "enableTracking"});
      if(status === "granted" && JSON.parse(value)){
        this.enableTrackingToggle = true;
      }
    })
  }
  
  subscribeToUserUpdates(){
    this.authService.user$.subscribe(async user => {
      if(user){
        this.outlet.swipeGesture = true; // explicitly enable the swipe gesture, DO NOT REMOVE!
        await this.loadLocations();
      }
    })
  }

  subscribeToLocationUpdate(){
    this.locationService.locationUpdated$.subscribe(async updated => {
      if(updated){
        let prevLocations = this.locations.length;
        await this.loadLocations();
        if(this.locations.length > prevLocations){
          await this.checkAndRequestLocationPermission();
          await this.checkAndRequestNotificationPermission();
        }
      }
    })
  }

  subsribeToEnableTrackingToggle(){
    this.userConfigService.enableTrackingToggle$.subscribe(isEnabled => {
      this.enableTrackingToggle = isEnabled;
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

  handleModalDismiss(type: "location" | "notification"){
    if(type === "location"){
      this.showLocationEnableSettingsModal = false;
    }else{
      this.showNotificationEnableSettingsModal = false;
    }
  }
}
