import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule]
})
export class ResetComponent  implements OnInit {
  @Input() form: FormGroup;
  isPasswordHidden: boolean = true;

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

  get isPasswordInputEmpty() : boolean{
    return this.form.controls['newPassword'].value.length === 0;
  }

  togglePasswordVisibility(){
    this.isPasswordHidden = !this.isPasswordHidden;
  }
}
