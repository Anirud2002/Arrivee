import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { VerifyCodeComponent } from '../verify-code/verify-code.component';
import { ResetPasswordService } from '../../../_services/reset-password.service';

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
  userFound: boolean = false;
  constructor(
    private resetPasswordService: ResetPasswordService
  ) { }

  ngOnInit() {
  }

  hasErrors(controlName: string, error: string):boolean{
    const control = this.form.controls[controlName];
    if(control.touched && control.hasError(error)){
      return true;
    }
    return false;
  }

  markAsTouched(controlName){
    console.log("yoo")
    const control = this.form.controls[controlName];
    control.markAsTouched();
  }

  async findAccount(){
    const username = this.form.controls['username'];
    username.markAsUntouched();
    this.userFound = await this.resetPasswordService.verifyAccount(username.value);
  }

}
