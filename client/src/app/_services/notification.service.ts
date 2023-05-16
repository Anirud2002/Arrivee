import { Injectable } from '@angular/core';
import { LocalNotifications} from "@capacitor/local-notifications"
import { Location } from '../_interfaces/Location.modal';
import { AuthService } from "../_services/auth.service"
import { NotificationDTO, NotificationResponseDTO } from '../_interfaces/Notification.modal';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, catchError, lastValueFrom, of } from 'rxjs';
import { ToastService } from './toast.service';
import { User } from '../_interfaces/Auth.modal';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  user: User;
  private notificationUpdated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  notificationUpdated$ = this.notificationUpdated.asObservable();
  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private http: HttpClient
  ) { }

  async getAllNotification(): Promise<NotificationResponseDTO[]>{
    if(!this.user){
      this.user = await this.authService.getUser();
    }

    const response = this.http.get<NotificationResponseDTO[]>(`${environment.baseApiUrl}/notification/get-all/${this.user.username}`)
    .pipe(
      catchError(_ => of(null))
    );

    const result = await lastValueFrom(response);
    if(!result){
      await this.toastService.createErrorToast("Couldn't get Notifications!");
      return null;
    }

    return result;

  }

  // schedules the notification based upon the date value received
  async schedule(date: Date, location: Location){
    await LocalNotifications.schedule({
      notifications: [{
        title: `You've ${location.reminders.length} things to do in ${location.title}.`,
        body: "Check it out!",
        id: 1,
        schedule: {
          at: date
        }
      }]
    });

    if(!this.user){
      this.user = await this.authService.getUser();
    }

    let notificationDTO = {
      username: this.user.username,
      createdOn: date.getTime(),
      locationID: location.locationID,
      title: `You've ${location.reminders.length} things to do in ${location.title}.`,
      body: "Check it out!"
    } as NotificationDTO

    await this.saveNotification(notificationDTO);
  }

  // saves the notification to the database
  async saveNotification(notificationDTO: NotificationDTO) {
    const response = this.http.post(`${environment.baseApiUrl}/notification/save`, notificationDTO)
    .pipe(
      catchError(_ => of(null))
    );

    const result = await lastValueFrom(response);
    if(!result){
      await this.toastService.createErrorToast("Something went wrong!");
      return;
    }

    this.notificationUpdated.next(true);
  }
}
