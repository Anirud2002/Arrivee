import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from '../_interfaces/Auth.modal';
import { Location, NewLocation } from '../_interfaces/Location.modal';
import { environment } from '../../environments/environment';
import { BehaviorSubject, catchError, lastValueFrom, of } from 'rxjs';
import { ToastService } from './toast.service';
import { Coords } from '../_interfaces/Location.modal';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  user: User;
  locations: Location[];
  private locationUpdated: BehaviorSubject<boolean> = new BehaviorSubject(false);
  locationUpdated$ = this.locationUpdated.asObservable();
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private toastService: ToastService
  ) { }

  async getLocations(): Promise<Location[]>{
    this.user = await this.authService.getUser();
    const response = this.http.get<Location[]>(`${environment.baseApiUrl}/location/get-all-location/${this.user.username}`)
    .pipe(
      catchError(() => {
        return of(null);
      })
    );

    this.locations = await lastValueFrom(response);

    if(!this.locations){
      await this.toastService.createErrorToast("Something went wrong!");
      return null;;
    }

    return this.locations;
  }

  async getLocationDetails(locationID: string): Promise<Location>{
    this.user = await this.authService.getUser();
    let location: Location;
    const response = this.http.get<Location>(`${environment.baseApiUrl}/location/get-location/${this.user.username}/${locationID}`)
    .pipe(
      catchError(() => {
        return of(null);
      })
    );

    location = await lastValueFrom(response);
    
    if(!location){
      await this.toastService.createErrorToast("Something went wrong!")
      return null;
    }

    return location;
  }

  async createLocation(newLocation: NewLocation): Promise<Location>{
    if(!this.user){
      this.user = await this.authService.getUser();
    }
    let location: Location;
    const response = this.http.post<Location>(`${environment.baseApiUrl}/location/create`, {...newLocation, username: this.user.username})
    .pipe(
      catchError(() => {
        return of(null);
      })
    );

    location = await lastValueFrom(response);

    if(!location){
      await this.toastService.createErrorToast("Couldn't save the location!");
      return null;
    }

    this.locationUpdated.next(true);

    return location;
  }

  async updateLocation(location: Location): Promise<Location>{
    let updateLocation: Location;
    const response = this.http.put<Location>(`${environment.baseApiUrl}/location/update`, location)
    .pipe(
      catchError(() => {
        return of(null);
      })
    )

    updateLocation = await lastValueFrom(response);

    if(!updateLocation){
      await this.toastService.createErrorToast("Couldn't save the location!");
      return null;
    }

    this.locationUpdated.next(true);

    return location;
  }

  async deleteLocation(locationID: string): Promise<void>{
    if(!this.user){
      this.user = await this.authService.getUser();
    }
    const response = this.http.delete(`${environment.baseApiUrl}/location/delete/${this.user.username}/${locationID}`)
    .pipe(
      catchError(() => {
        return of(null);
      })
    );

    const result = await lastValueFrom(response);

    if(!result){
      await this.toastService.createErrorToast("Couldn't delete locations!");
      return;
    }

    this.locationUpdated.next(true);

    await this.toastService.createSuccessToast("Deleted!");
    return;
  }

  // checks users and location coords and triggers the push notificaion workflow 
  checkUserAndLocationsCoords(userCoord: Coords){
    if(!this.locations){
      return;
    }
    this.locations.forEach(location => {
      let distanceFromUser = this.getDistance(userCoord.latitude, userCoord.longitude, location.coords.latitude, location.coords.longitude, location.radiusUnit);
      if(distanceFromUser <= location.radius){
        // the workflow to trigger the notification goes in here
        this.toastService.createSuccessToast("You have a notification");
      }
    })
  }

  // gets distance between users coords and location coords in correct unit
  getDistance(userLat: number, userLng: number, locationLat: number, locationLng: number, unit: string): number{
    const earthRadius = 6371; // Radius of the earth in km
    const dLat = this.deg2Rad(locationLat - userLat); // deg2Rad below
    const dLon = this.deg2Rad(locationLng - userLng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2Rad(userLat)) *
        Math.cos(this.deg2Rad(locationLat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = this.convertDistance(earthRadius * c, unit);
    return distance;
  }

  // converts the distance unit
  convertDistance(distance: number, unit: string): number{
    switch(unit){
      case "km":
        return distance;
      case "m":
        return distance * 1000;
      case "mil":
        return distance / 1.609;
      default:
        return distance;
    }
  }

  // converts degree value to radian
  deg2Rad(deg: number){
    return deg * (Math.PI / 180);
  }
}
