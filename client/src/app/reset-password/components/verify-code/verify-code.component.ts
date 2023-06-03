import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ResetComponent } from '../reset/reset.component';
import { ResetPasswordService } from '../../../_services/reset-password.service';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.scss'],
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, ResetComponent]
})
export class VerifyCodeComponent  implements OnInit {
  component = ResetComponent;
  @Input() form: FormGroup;
  isCodeValid: boolean = false;
  constructor(
    private resetPasswordService: ResetPasswordService
  ) { }

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

  async verifyCode(){
    if(!this.isCodeValid){
      const code = this.form.controls["code"];
      const username = this.form.controls["username"];
      code.markAsUntouched();
      this.isCodeValid = await this.resetPasswordService.verifyCode(username.value, code.value);
    }
  }

}
