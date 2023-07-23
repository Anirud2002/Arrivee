import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SignInWithApple, AppleSignInResponse, AppleSignInErrorResponse, ASAuthorizationAppleIDRequest } from '@awesome-cordova-plugins/sign-in-with-apple/ngx';
import { Device } from '@capacitor/device';
@Injectable({
  providedIn: 'root'
})
export class AppleAuthService {
  jwtHelperService = new JwtHelperService();
  constructor(
    // private signInWithApple: SignInWithApple
  ) { }

  async signIn(): Promise<any> {
    const platform = (await Device.getInfo()).platform;
    if(platform !== "ios"){
      return;
    }

    const signInWApple = new SignInWithApple();
    signInWApple.signin({
      requestedScopes: [
        ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
        ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail
      ]
    })
    .then((res: AppleSignInResponse) => {
      // https://developer.apple.com/documentation/signinwithapplerestapi/verifying_a_user
      // alert('Send token to apple for verification: ' + res.identityToken);
      alert(JSON.stringify(res));
      console.log(JSON.stringify(res));
    })
    .catch((error: AppleSignInErrorResponse) => {
      alert(error.code + ' ' + error.localizedDescription);
      console.error(error);
    });

    console.log("Last")
  }
}
