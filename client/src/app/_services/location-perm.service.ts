import { Injectable } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Coords } from '../_interfaces/Location.modal';
import { BehaviorSubject } from 'rxjs';
import { LocationService } from './location.service';

@Injectable({
  providedIn: 'root'
})
export class LocationPermService {
  private locationPermStatus: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  locationPermStatus$ = this.locationPermStatus.asObservable();
  userCoords: Coords;
  watchID: string;

  constructor(
    private locationService: LocationService,
  ) { }

  async checkPermission(): Promise<string>{
    const permStatus = await Geolocation.checkPermissions();
    this.locationPermStatus.next(permStatus.location);
    return permStatus.location;
  }

  async requestLocationPermission(){
    const permStatus = await Geolocation.requestPermissions();
    this.locationPermStatus.next(permStatus.location);
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
    })
  }
}
