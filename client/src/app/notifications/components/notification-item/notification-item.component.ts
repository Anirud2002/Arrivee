import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class NotificationItemComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
