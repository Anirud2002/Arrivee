import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {
  form: FormGroup;
  isPasswordHidden: boolean = true;
  constructor(
    private formBuilder: FormBuilder
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

}
