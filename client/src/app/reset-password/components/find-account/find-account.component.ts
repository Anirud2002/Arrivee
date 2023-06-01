import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-find-account',
  templateUrl: './find-account.component.html',
  styleUrls: ['./find-account.component.scss'],
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule]
})
export class FindAccountComponent  implements OnInit {
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
