import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, lastValueFrom, of } from 'rxjs';
import { ToastService } from './toast.service';
import { ResetPasswordDTO } from '../_interfaces/Auth.modal';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(
    private http: HttpClient,
    private toastService: ToastService
  ) { }

  async verifyAccount(username: string): Promise<boolean>{
    const apiCall = this.http.get<any>(`${environment.baseApiUrl}/auth/verify-account/${username}`)
    .pipe(
      catchError(_ => {
        return of(null);
      })
    );

    const response = await lastValueFrom(apiCall);
    if(!response) {
      return false;
    }
    
    this.toastService.createSuccessToast(`Sent Verification Code at ${response.secretEmail}.`, 2000)
    return true;
  }

  async verifyCode(username: string, code: number): Promise<boolean>{
    const apiCall = this.http.get<any>(`${environment.baseApiUrl}/auth/verify-code/${username}/${code}`)
    .pipe(
      catchError(_ => {
        return of(null);
      })
    );

    const response = await lastValueFrom(apiCall);
    if(!response) {
      return false;
    }

    return true;
  }

  async resetPassword(resetPasswordDTO: ResetPasswordDTO): Promise<boolean> {
    const apiCall = this.http.put<any>(`${environment.baseApiUrl}/user/reset-password`, resetPasswordDTO)
    .pipe(
      catchError(_ => {
        return of(null);
      })
    );

    const response = await lastValueFrom(apiCall);
    if(!response) {
      return false;
    }

    this.toastService.createSuccessToast("Password Reset Successfull!")
    return true;
  }
}
