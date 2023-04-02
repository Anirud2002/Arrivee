import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { NotificationItemComponent } from './components/notification-item/notification-item.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: true,
  imports: [SharedModule, NotificationItemComponent]
})
export class NotificationsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
