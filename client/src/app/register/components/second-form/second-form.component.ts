import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-second-form',
  templateUrl: './second-form.component.html',
  styleUrls: ['./second-form.component.scss'],
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule]
})
export class SecondFormComponent  implements OnInit {
  @Input() form: FormGroup;
  isPasswordHidden: boolean = true;
  confirmPasswordValue: string = "";
  constructor() { }

  ngOnInit() {}

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

  togglePasswordVisibility(){
    this.isPasswordHidden = !this.isPasswordHidden;
  }

  get isPasswordInputEmpty() : boolean{
    return this.form.controls['password'].value.length === 0;
  }

  get passwordMatched(): boolean{
    if(this.confirmPasswordValue.length === 0){
      return false;
    }
    const password = this.form.controls['password'].value;
    if(password === this.confirmPasswordValue) return true;
    return false;
  }
}
