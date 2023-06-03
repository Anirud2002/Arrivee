import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ResetPasswordService } from '../../../_services/reset-password.service';
import { ResetPasswordDTO } from '../../../_interfaces/Auth.modal';

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
  confirmPwdValue: string = "";
  pwdNotMatchedError: boolean = false;
  constructor(
    private router: Router,
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

  get isPasswordInputEmpty() : boolean{
    return this.form.controls['newPassword'].value.length === 0;
  }

  togglePasswordVisibility(){
    this.isPasswordHidden = !this.isPasswordHidden;
  }

  async resetPassword(){
    const newPassword = this.form.controls["newPassword"].value;
    if(newPassword != this.confirmPwdValue){
      this.pwdNotMatchedError = true;
    }else {
      const username = this.form.controls["username"].value;
      let resetPasswordDTO: ResetPasswordDTO = {
        username,
        newPassword
      };
      const operationSuccess = await this.resetPasswordService.resetPassword(resetPasswordDTO);
      if(operationSuccess){
        this.router.navigateByUrl("/login");
      }else {
        return;
      }
    }
  }
}
