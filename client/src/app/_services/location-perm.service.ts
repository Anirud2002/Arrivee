import { Injectable } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Coords } from '../_interfaces/Location.modal';
import { BehaviorSubject } from 'rxjs';
import { LocationService } from './location.service';

@Injectable({
  providedIn: 'root'
})
export class LocationPermService {
  locationPermState: string;
  userCoords: Coords;
  watchID: string;
  private locationPermStateUpdated: BehaviorSubject<string> = new BehaviorSubject<string>(null); // this will be used in the settings page to toggle/un-toggle the location
  locationPermStateUpdated$ = this.locationPermStateUpdated.asObservable();

  constructor(
    private locationService: LocationService
  ) { }

  async checkPermission(): Promise<string>{
    const permStatus = await Geolocation.checkPermissions();
    if(permStatus){
      this.locationPermState = permStatus.location; 
      this.locationPermStateUpdated.next(this.locationPermState);
    }
    return this.locationPermState;
  }

  async requestLocationPermission(){
    const requestPerm = await Geolocation.requestPermissions();
    if(requestPerm){
      this.locationPermState = requestPerm.location;
      this.locationPermStateUpdated.next(this.locationPermState);
      // if granted, watch users location
      if(this.locationPermState === "granted"){
        await this.watchUsersLocation();
      }
    }
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
