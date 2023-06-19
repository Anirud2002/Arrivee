import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, lastValueFrom, map, of, take, tap, throwError } from 'rxjs';
import { HttpClient } from "@angular/common/http"
import { GoogleSignInDTO, LoginDTO, RegisterDTO, UpdateUserDTO, User } from '../_interfaces/Auth.modal';
import { environment } from '../../environments/environment';
import { Preferences } from '@capacitor/preferences';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';
import { UserConfigService } from './user-config.service';

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
    private userConfigService: UserConfigService,
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
        catchError((_) => { // if login creds do not match
          return of(null); 
        })
      );
      this.user = await lastValueFrom(response);

      if(!this.user){
        return false;
      }

      this.setUser(this.user);

      return true;
  }

  async register(registerDTO: RegisterDTO): Promise<boolean>{
    const response = this.http.post<User>(`${environment.baseApiUrl}/auth/register`, registerDTO)
    .pipe(
      catchError((_) => {
        return of(null);
      })
    );

    this.user = await lastValueFrom(response);

    if(!this.user){
      return false;
    }

    this.setUser(this.user);

    return true;
  }

  async logout(){
    await Preferences.remove({key: "user"});

    this.user = null;

    this.userSubject.next(this.user);

    this.userConfigService.setEnableTrackingValue(false, "whatever"); // we just need to delete the key so don't care what the location status is

    this.router.navigateByUrl("/login");

    await this.toastService.createSuccessToast("Successfully logged out!");
  }

  async getTokenForGoogleSignIn(username: string): Promise<string>{
    let token: string = "";
    const response = this.http.get<any>(`${environment.baseApiUrl}/auth/token/${username}`)
    .pipe(
      catchError(() => of(null))
    );

    token  = (await lastValueFrom(response)).value;

    if(!token){
      await this.toastService.createErrorToast("Couldn't sign in");
      return  null;
    }

    return token;
  }


  // Returns true if username can be used, else returns false
  async checkUsername(username: string): Promise<boolean>{
    const response = await lastValueFrom(this.http.get<boolean>(`${environment.baseApiUrl}/auth/check-username/${username}`)); 
    return response;
  }

  async setUser(user: User){
      // set the user using Capacitor Preferences
      await Preferences.set({
        key: 'user',
        value: JSON.stringify(user)
      })

      // set user
      this.user = user;

      // update the observable
      this.userSubject.next(user);
  }

  async getUser(): Promise<User>{
    return JSON.parse((await Preferences.get({key: 'user'})).value) as User;
  }

  async updateUser(updateUserDTO: UpdateUserDTO){
    let apiCall = this.http.put<Promise<any>>(`${environment.baseApiUrl}/user/update`, updateUserDTO)
    .pipe(
      catchError((_) => {
        return of(null);
      })
    );

    let response = await lastValueFrom(apiCall);

    if(!response){
      return;
    }

    this.user = await this.getUser();

    let user = {
      firstname: updateUserDTO.firstname,
      lastname: updateUserDTO.lastname,
      username: updateUserDTO.username,
      email: this.user.email,
      token: response.token ?? this.user.token,
      isGoogleUser: this.user.isGoogleUser
    } as User
    
    this.setUser(user);

    this.toastService.createSuccessToast("Updated!")
  }
  
}
