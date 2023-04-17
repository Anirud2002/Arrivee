import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { Reminder } from '../../../_interfaces/Reminder.modal';

@Component({
  selector: 'app-reminder-item',
  templateUrl: './reminder-item.component.html',
  styleUrls: ['./reminder-item.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class ReminderItemComponent  implements OnInit {
  @Input() reminder: Reminder;
  isInEditState: boolean = false;
  constructor() { }

  ngOnInit() {}

  handleEdit(){
    this.isInEditState = true;
  }

  handleCancelEditState(){
    this.isInEditState = false;
  }

  handleDelete(){

  }

}
