import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FirstFormComponent } from './components/first-form/first-form.component';
import { SecondFormComponent } from './components/second-form/second-form.component';
import { SharedModule } from '../shared/shared.module';

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
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
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
    this.formPart = 2;
  }

  handleCanRegister(e){
    this.registerButtonEnable = true;
  }

  handleRegister(){
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
