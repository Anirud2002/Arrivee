import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, lastValueFrom, of, throwError } from 'rxjs';
import { HttpClient } from "@angular/common/http"
import { LoginDTO, RegisterDTO, User } from '../_interfaces/Auth.modal';
import { environment } from '../../environments/environment';
import { Preferences } from '@capacitor/preferences';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NavigationExtras, Router } from '@angular/router';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: User;
  jwtHelperService = new JwtHelperService();
  private userSubject: BehaviorSubject<User> = new BehaviorSubject(null);
  user$: Observable<User> = this.userSubject.asObservable();
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastService: ToastService,
  ) { }

  async isAuthenticated(): Promise<boolean>{
    let user = JSON.parse((await Preferences.get({key: 'user'})).value) as User;
    if(!user){
      return false;
    }

    if(this.jwtHelperService.isTokenExpired(user.token)){
      return false;
    }

    this.userSubject.next(user); // hacky way, might need a better solution in future

    return true;
  }

  async login(loginDTO: LoginDTO): Promise<boolean>{
      const response = this.http.post<User>(`${environment.baseApiUrl}/auth/login`, loginDTO)
      .pipe(
        catchError((err) => { // if login creds do not match
          let message = err.error.message;
          this.toastService.createErrorToast(message);
          return of(null); 
        })
      );
      this.user = await lastValueFrom(response);
      console.log(this.user);

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
        this.toastService.createErrorToast(message);
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

  async logout(){
    await Preferences.remove({key: "user"});

    this.user = null;

    this.userSubject.next(this.user);

    this.router.navigateByUrl("/login");

    await this.toastService.createSuccessToast("Successfully logged out!");
  }


  // Returns true if username can be used, else returns false
  async checkUsername(username: string): Promise<boolean>{
    const response = lastValueFrom(await this.http.get<boolean>(`${environment.baseApiUrl}/auth/check-username/${username}`)); 
    return response;
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

  async getUser(): Promise<User>{
    return JSON.parse((await Preferences.get({key: 'user'})).value) as User;
  }
  
}
