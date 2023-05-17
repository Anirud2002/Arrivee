import { Injectable } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Coords } from '../_interfaces/Location.modal';
import { BehaviorSubject } from 'rxjs';
import { LocationService } from './location.service';
import { UserConfigService } from './user-config.service';
import { NotificationPermService } from './notification-perm.service';

@Injectable({
  providedIn: 'root'
})
export class LocationPermService {
  userCoords: Coords;
  watchID: string;

  constructor(
    private locationService: LocationService,
  ) { }

  async checkPermission(): Promise<string>{
    const permStatus = await Geolocation.checkPermissions();
    return permStatus.location;
  }

  async requestLocationPermission(){
    await Geolocation.requestPermissions();
  }

  async watchUsersLocation(){
    this.watchID = await Geolocation.watchPosition({
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0
    }, (position) => {
      this.userCoords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
      console.log("second")
      this.locationService.checkUserAndLocationsCoords(this.userCoords);
    })
  }

  async clearWatchUserLocation(){
    if(this.watchID){
      await Geolocation.clearWatch({id: this.watchID});
      this.userCoords = null;
    }
  }
}
