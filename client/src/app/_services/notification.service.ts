import { Injectable } from '@angular/core';
import { LocalNotifications} from "@capacitor/local-notifications"
import { Location } from '../_interfaces/Location.modal';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  async schedule(date: Date, location: Location){
    await LocalNotifications.schedule({
      notifications: [{
        title: `You've ${location.reminders.length} things to do in ${location.title}.`,
        body: "Check it out!",
        id: 1
      }]
    });

    // need to save the notification to the database
    // Let's go home and do that, shall we?
  }
}
