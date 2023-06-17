import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { User } from '../_interfaces/Auth.modal';
import { catchError, lastValueFrom, of } from 'rxjs';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  user: User;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  // returns true if api call was successfull, else returns false
  async sendFeedback(feedback: string, stars: number): Promise<boolean>{
    if(!this.user){
      this.user = await this.authService.getUser();
    }

    let feedbackDTO = {
      firstname: this.user.firstname,
      lastname: this.user.lastname,
      username: this.user.username,
      feedback,
      stars
    } as FeedbackDTO

    const apiCall = this.http.post<Promise<any>>(`${environment.baseApiUrl}/feedback/send-feedback`, feedbackDTO)
    .pipe(
      catchError(_ => {
        this.toastService.createErrorToast("Couldn't send feedback!");
        return of(null);
      })
    )

    let response = await lastValueFrom(apiCall);

    if(!response){
      return false;
    }

    this.toastService.createSuccessToast("Thank you for your feedback!")
    return true;
  }
}

export interface FeedbackDTO {
  firstname: string,
  lastname: string,
  username: string,
  feedback: string,
  stars: number
}
