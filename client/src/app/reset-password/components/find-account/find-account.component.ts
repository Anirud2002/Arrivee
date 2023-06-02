import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { VerifyCodeComponent } from '../verify-code/verify-code.component';

@Component({
  selector: 'app-find-account',
  templateUrl: './find-account.component.html',
  styleUrls: ['./find-account.component.scss'],
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, VerifyCodeComponent]
})
export class FindAccountComponent  implements OnInit {
  component = VerifyCodeComponent;
  @Input() form: FormGroup;
  constructor() { }

  ngOnInit() {
    console.log(this.form.value);
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
