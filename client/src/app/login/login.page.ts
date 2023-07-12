import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from '../_services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { GoogleAuthService } from '../_services/google-auth.service';
import { IonRouterOutlet } from '@ionic/angular';
import { AppleAuthService } from '../_services/apple-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule],
  providers: [JwtHelperService]
})
export class LoginPage implements OnInit {
  form: FormGroup;
  isPasswordHidden: boolean = true;
  errorOccurred: boolean = false;
  isLoggingIn: boolean = false;
  isGoogleSigningIn: boolean = false;
  isAppleSigningIn: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private googleAuthService: GoogleAuthService,
    private appleAuthService: AppleAuthService,
    private router: Router,
    private outlet: IonRouterOutlet
  ) { }

  ngOnInit() {
    this.initForm();
    this.subscribeToUserStatus();
    this.outlet.swipeGesture = false;
   }

  initForm(){
    this.form = this.formBuilder.group({ 
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  subscribeToUserStatus(){
    this.authService.user$.subscribe(user => {
      if(!user){
        let username = this.form.controls["username"].value;
        this.initForm();
        this.form.get("username").patchValue(username);
      }
    })
  }

  togglePasswordVisibility(){
    this.isPasswordHidden = !this.isPasswordHidden;
  }

  hasErrors(controlName: string, error: string):boolean{
    const control = this.form.controls[controlName];
    if(control.touched && control.hasError(error)){
      return true;
    }
    return false;
  }

  markAsTouched(controlName){
    const control = this.form.controls[controlName];
    control.markAsTouched();
  }

  get isPasswordInputEmpty() : boolean{
    return this.form.controls['password'].value.length === 0;
  }

  async handleLogin(){
    const controlNames = Object.keys(this.form.controls);
    let errorCounts = 0;
    // loop through each control and check if it has errors
    for (const controlName of controlNames) {
      this.markAsTouched(controlName)
      if(this.form.controls[controlName].errors != null){
        errorCounts++;
      }
    }

    if(errorCounts === 0){
        // handle register user
      this.isLoggingIn = true;
      const retVal = await this.authService.login(this.form.value);
      if(!retVal){
        this.errorOccurred = true;
        const passwordControl = this.form.controls['password'];
        passwordControl.markAsUntouched();
        passwordControl.patchValue("");
      }else {
        this.router.navigateByUrl("/home")
      }
    }

    this.isLoggingIn = false;
  }

  async handleGoogleSignIn(){
    this.isGoogleSigningIn = true;
    await this.googleAuthService.signIn()
    .then(() => this.isGoogleSigningIn = false)
    .catch(() => this.isGoogleSigningIn = false)
  }

  async handleAppleSignIn(){
    this.isAppleSigningIn = true;
    this.appleAuthService.signIn()
    .then(() => this.isAppleSigningIn = false)
    .catch(() => this.isAppleSigningIn = false);
  }

}
