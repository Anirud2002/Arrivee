import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { FindAccountComponent } from './components/find-account/find-account.component';
import { VerifyCodeComponent } from './components/verify-code/verify-code.component';
import { ResetComponent } from './components/reset/reset.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, FindAccountComponent, VerifyCodeComponent, ResetComponent]
})
export class ResetPasswordPage implements OnInit {
  rootComponent = FindAccountComponent;
  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm(){
    this.form = this.formBuilder.group({ 
      username: ['', Validators.required],
      code: ['', Validators.required],
      newPassword: ['', Validators.required]
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

}
