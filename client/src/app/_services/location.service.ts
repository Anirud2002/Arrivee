import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from '../_interfaces/Auth.modal';
import { Location, NewLocation, UpdateTimestampDTO } from '../_interfaces/Location.modal';
import { environment } from '../../environments/environment';
import { BehaviorSubject, catchError, lastValueFrom, of } from 'rxjs';
import { ToastService } from './toast.service';
import { NotificationService } from './notification.service';

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
    private notificationService: NotificationService,
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

  async updateLocationTimestamp(locationID: string): Promise<number>{
    if(!locationID) return null;
    if(!this.user){
      this.user = await this.authService.getUser();
    }
    let updateTimestampDTO = {
      locationID,
      username: this.user.username
    } as UpdateTimestampDTO
    const response = this.http.put<number>(`${environment.baseApiUrl}/location/update-timestamp`, updateTimestampDTO);
    const result = await lastValueFrom(response);
    return result;
  }

}
