import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output() navFormButtonClicked: EventEmitter<number> = new EventEmitter();

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

  togglePasswordVisibility(){
    this.isPasswordHidden = !this.isPasswordHidden;
  }

  get isPasswordInputEmpty() : boolean{
    return this.form.controls['password'].value.length === 0;
  }

  isPasswordSame(){
    const password = this.form.controls['password'];
    const confirmPassword = this.form.controls['confirmPassword'];
    return password.value === confirmPassword.value;
  }

  handlePrevForm(){
    this.navFormButtonClicked.emit(1);
  }
}
