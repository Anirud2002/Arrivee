import { Injectable } from '@angular/core';
import { GoogleAuth} from '@codetrix-studio/capacitor-google-auth';
import { User } from '../_interfaces/Auth.modal';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  user: User;
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  async signIn() {
    var response = await GoogleAuth.signIn();
    this.user = {
      firstname: response.givenName,
      lastname: response.familyName,
      username: response.email.split("@")[0],
      email: response.email,
      token: await this.authService.getTokenForGoogleSignIn(response.email.split("@")[0])
    }
    await this.authService.setUser(this.user);
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
