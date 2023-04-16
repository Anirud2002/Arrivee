import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../_services/auth.service';

@Component({
  selector: 'app-first-form',
  templateUrl: './first-form.component.html',
  styleUrls: ['./first-form.component.scss'],
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule]
})
export class FirstFormComponent  implements OnInit {
  @Input() form: FormGroup;
  @Input() usernameTaken: boolean = false; // this value comes from parent
  @Output() navFormButtonClicked: EventEmitter<number> = new EventEmitter();
  constructor(
    private authService: AuthService
  ) { 
  }

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
    const control = this.form.controls[controlName];
    control.markAsTouched();
  }

  async checkUsername(){
    const username = this.form.controls['username'].value;
    if(username){
      const response = await this.authService.checkUsername(username);
      if(response){
        return;
      }else{
        this.usernameTaken = true;
      }
    }
  }

  handleNextForm(){
    this.navFormButtonClicked.emit(2);
  }

}
