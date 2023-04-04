import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-reminder-item-modal',
  templateUrl: './reminder-item-modal.component.html',
  styleUrls: ['./reminder-item-modal.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class ReminderItemModalComponent  implements OnInit {
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
