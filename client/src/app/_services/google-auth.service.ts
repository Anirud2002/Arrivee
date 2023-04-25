import { Injectable } from '@angular/core';
import { GoogleAuth} from '@codetrix-studio/capacitor-google-auth';
import { GoogleSignInDTO, User } from '../_interfaces/Auth.modal';
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

    let googleSignInDTO = {
      username: this.user.username,
      firstname: this.user.firstname,
      lastname: this.user.lastname,
      email: this.user.email
    } as GoogleSignInDTO

    const operationSuccess = await this.authService.googleLoginOrRegister(googleSignInDTO);
    if(!operationSuccess){
      return;
    }else{
      await this.authService.setUser(this.user);
      this.router.navigateByUrl("/");
    }
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
