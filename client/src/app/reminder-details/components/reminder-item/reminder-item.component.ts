import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { Reminder } from '../../../_interfaces/Reminder.modal';
import { IonInput } from '@ionic/angular';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-reminder-item',
  templateUrl: './reminder-item.component.html',
  styleUrls: ['./reminder-item.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class ReminderItemComponent  implements OnInit{
  @Input() reminder: Reminder;
  @Input() index: number;
  @Output() reminderUpdatedBool: EventEmitter<boolean> = new EventEmitter(false);
  @Output() reminderDeleted: EventEmitter<number> = new EventEmitter(null);
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
    this.reminderUpdatedBool.emit(true);
  }

  handleCancelEditState(){
    this.isInEditState = false;
  }

  handleDelete(){
    this.reminderDeleted.emit(this.index);
  }

}
