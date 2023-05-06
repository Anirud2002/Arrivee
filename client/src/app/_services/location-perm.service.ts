import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class LocationPermService {
  locationPermState: string;
  constructor() { }

  async getUsersCurrentLocation(): Promise<Position> {
    const coordinates = await Geolocation.getCurrentPosition();
    return coordinates;
  }

  async checkPermission(): Promise<string>{
    const permStatus = await Geolocation.checkPermissions();
    this.locationPermState = permStatus.location; 
    console.log("1")
    return this.locationPermState;
  }

  async requestLocationPermission(){
    console.log("2");
    const requestPerm = await Geolocation.requestPermissions();
    this.locationPermState = requestPerm.location;
    console.log(this.locationPermState);
  }
}
