import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonRouterOutlet, IonicModule } from '@ionic/angular';
import { FirstFormComponent } from './components/first-form/first-form.component';
import { SecondFormComponent } from './components/second-form/second-form.component';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from '../_services/auth.service';
import { RegisterDTO } from '../_interfaces/Auth.modal';
import { Router } from '@angular/router';
import { GoogleAuthService } from '../_services/google-auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, FirstFormComponent, SecondFormComponent]
})
export class RegisterPage implements OnInit {
  form: FormGroup;
  formPart: number = 1;
  registerButtonEnable: boolean = false;
  usernameTaken: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private googleAuthService: GoogleAuthService,
    private router: Router,
    private outlet: IonRouterOutlet
  ) { }

  ngOnInit() {
    this.initForm();
    this.outlet.swipeGesture = false;
  }

  initForm(){
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    })
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

  handleChangeFormPart(e){
    let formPart = e;
    this.formPart = formPart;
  }

  handleCanRegister(e){
    this.registerButtonEnable = true;
  }

  async handleRegister(){
    let errorCount = 0;
    const firstFormControlNames = ['username', 'firstname', 'lastname', 'email']
    for(let i = 0; i < firstFormControlNames.length; i++){
      this.markAsTouched(firstFormControlNames[i]);
      if(this.form.controls[firstFormControlNames[i]].errors != null){
        errorCount++;
      }
    }
    if(errorCount > 0){
      this.formPart = 1;
      return;
    }

    const secondFormControlNames = ['password', 'confirmPassword'];
    for(let i = 0; i < secondFormControlNames.length; i++){
      this.markAsTouched(secondFormControlNames[i]);
      if(this.form.controls[secondFormControlNames[i]].errors != null){
        errorCount++;
      }
    }

    if(errorCount > 0){
      this.formPart = 2;
      return;
    }

    if(errorCount=== 0){
      // handle register user
      let registerDTO = new FormGroup({
        firstname: this.form.get('firstname'),
        lastname: this.form.get('lastname'),
        username: this.form.get('username'),
        email: this.form.get('email'),
        password: this.form.get('password'),
      }).value as RegisterDTO;

      const retVal = await this.authService.register(registerDTO);

      if(!retVal){
        this.formPart = 1;
        this.usernameTaken = true;
        return;
      }
      this.router.navigateByUrl("/home")
    }
  }

  async handleGoogleSignIn(){
    await this.googleAuthService.signIn();
  }

}
