import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-reminder-item',
  templateUrl: './reminder-item.component.html',
  styleUrls: ['./reminder-item.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class ReminderItemComponent  implements OnInit {
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
