import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.scss'],
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule]
})
export class VerifyCodeComponent  implements OnInit {
  @Input() form: FormGroup;
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

}
