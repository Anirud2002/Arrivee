import { Injectable } from '@angular/core';
import { GoogleAuth} from '@codetrix-studio/capacitor-google-auth';
import { GoogleSignInDTO, User } from '../_interfaces/Auth.modal';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastService } from './toast.service';
import { environment } from '../../environments/environment';
import { catchError, lastValueFrom, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  user: User;
  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private toastService: ToastService
  ) { }

  async signIn() {
    var googleRes = await GoogleAuth.signIn();

    let googleSignInDTO = {
      firstname: googleRes.givenName,
      lastname: googleRes.familyName,
      email: googleRes.email
    } as GoogleSignInDTO

    const response = this.http.post<User>(`${environment.baseApiUrl}/googleauth/login`, googleSignInDTO)
    .pipe(
      catchError(_ => {
        this.toastService.createErrorToast("Couldn't SignIn using Google!");
        return of(null);
      })
    );

    this.user = await lastValueFrom(response);

    if(!this.user) return;

    this.authService.setUser(this.user);
    this.router.navigateByUrl("/");
  }

  async refresh() {
    const authCode = await GoogleAuth.refresh();
    console.log('refresh: ', authCode);
  }

  async signOut() {
    await GoogleAuth.signOut();
    this.user = null;
  }
}
