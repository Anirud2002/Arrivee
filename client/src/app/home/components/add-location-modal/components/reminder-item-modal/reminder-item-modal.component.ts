import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';
import { Reminder } from '../../../../../_interfaces/Reminder.modal';

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
  isInEditState: boolean = false;
  constructor() { }

  ngOnInit() {}

  handleEdit(){
    this.isInEditState = true;
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
