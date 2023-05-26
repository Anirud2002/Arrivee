import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';
import { Reminder } from '../../../../../_interfaces/Reminder.modal';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-reminder-item-modal',
  templateUrl: './reminder-item-modal.component.html',
  styleUrls: ['./reminder-item-modal.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class ReminderItemModalComponent  implements OnInit {
  @Input() reminder: Reminder;
  @Input() index: number;
  @ViewChild("remTitleInput", {static: false}) remTitleInput: IonInput;

  isInEditState: boolean = false;
  constructor() { }

  ngOnInit() {}

  handleEdit(){
    this.isInEditState = true;
    setTimeout(() => { // HACKY WAY TO SET THE INPUT TO FOCUS, IF FOUND BETTER WAY, REPLACE IT
      this.remTitleInput.setFocus();
    }, 200);
  }

  updateRemTitle(e){
    this.reminder.title = e.detail.value;
  }

  setReminderUpdatedToTrue(){
    if(!this.reminder.title){
      this.handleDelete();
      return;
    }
    this.isInEditState = false;
  }

  handleCancelEditState(){
    this.isInEditState = false;
  }

  handleDelete(){

  }

}
