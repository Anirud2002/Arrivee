import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-first-form',
  templateUrl: './first-form.component.html',
  styleUrls: ['./first-form.component.scss'],
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule]
})
export class FirstFormComponent  implements OnInit {
  @Input() form: FormGroup;
  @Output() navFormButtonClicked: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    console.log(this.form)
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

  handleNextForm(){
    this.navFormButtonClicked.emit(2);
  }

}
