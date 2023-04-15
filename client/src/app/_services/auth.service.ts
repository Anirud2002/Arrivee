import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, lastValueFrom, of, throwError } from 'rxjs';
import { HttpClient } from "@angular/common/http"
import { LoginDTO, RegisterDTO, User } from '../_interfaces/Auth.modal';
import { environment } from '../../environments/environment';
import { Preferences } from '@capacitor/preferences';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: User;
  jwtHelperService = new JwtHelperService();
  private userSubject: BehaviorSubject<User> = new BehaviorSubject(null);
  constructor(
    private http: HttpClient,
    private toastController: ToastController
  ) { }

  async isAuthenticated(): Promise<boolean>{
    let user = JSON.parse((await Preferences.get({key: 'user'})).value) as User;
    if(!user){
      return false;
    }

    if(this.jwtHelperService.isTokenExpired(user.token)){
      return false;
    }

    return true;
  }

  async login(loginDTO: LoginDTO): Promise<boolean>{
      const response = this.http.post<User>(`${environment.baseApiUrl}/auth/login`, loginDTO)
      .pipe(
        catchError((err) => { // if login creds do not match
          let message = err.error.message;
          this.presentErrorToast(message);
          return of(null); 
        })
      );
      this.user = await lastValueFrom(response);

      if(!this.user){ //  handle if user == null
        return false;
      }

      this.setUser();

      return true;
  }

  async register(registerDTO: RegisterDTO): Promise<boolean>{
    const response = this.http.post<User>(`${environment.baseApiUrl}/auth/register`, registerDTO)
    .pipe(
      catchError((err) => {
        let message = err.error.message
        this.presentErrorToast(message);
        return of(null);
      })
    );

    this.user = await lastValueFrom(response);

    if(!this.user){
      return false;
    }

    this.setUser();

    return true;
  }

  async setUser(){
      // set the user using Capacitor Preferences
      await Preferences.set({
        key: 'user',
        value: JSON.stringify(this.user)
      })

      // update the observable
      this.userSubject.next(this.user);
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
