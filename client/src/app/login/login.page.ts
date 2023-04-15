import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {
  form: FormGroup;
  isPasswordHidden: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) { 
    this.initForm();
  }

  ngOnInit() {
    this.initForm();
  }

  initForm(){
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
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

  handleLogin(){
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
    }
  }

}
