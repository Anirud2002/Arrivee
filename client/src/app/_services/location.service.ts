import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from '../_interfaces/Auth.modal';
import { Location, NewLocation } from '../_interfaces/Location.modal';
import { environment } from '../../environments/environment';
import { BehaviorSubject, catchError, lastValueFrom, of } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  user: User;
  private locationUpdated: BehaviorSubject<boolean> = new BehaviorSubject(false);
  locationUpdated$ = this.locationUpdated.asObservable();
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private toastController: ToastController,
    private toastService: ToastService
  ) { 
    
  }

  async getLocations(): Promise<Location[]>{
    this.user = await this.authService.getUser();
    let locations = [] as Location[];
    const response = this.http.get<Location[]>(`${environment.baseApiUrl}/location/get-all-location/${this.user.username}`)
    .pipe(
      catchError(() => {
        return of(null);
      })
    );

    locations = await lastValueFrom(response);

    if(!locations){
      await this.toastService.createErrorToast("Something went wrong!");
      return null;;
    }

    return locations;
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
}
