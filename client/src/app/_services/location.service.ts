import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from '../_interfaces/Auth.modal';
import { Location } from '../_interfaces/Location.modal';
import { environment } from '../../environments/environment';
import { catchError, lastValueFrom, of } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  user: User;
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private toastController: ToastController
  ) { 
    
  }

  async getLocations(): Promise<Location[]>{
    this.user = await this.authService.getUser();
    let locations = [] as Location[];
    const response = await this.http.get<Location[]>(`${environment.baseApiUrl}/location/get-all-location/${this.user.username}`)
    .pipe(
      catchError(() => {
        return of(null);
      })
    )

    locations = await lastValueFrom(response);

    if(!locations){
      await this.presentErrorToast("Something went wrong!");
      return null;;
    }

    return locations;
  }

  async presentErrorToast(message: string){
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, 
      color: 'danger'
    });
    
    await toast.present();
  }
}
