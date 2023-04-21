import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ToastService } from './toast.service';
import { catchError, lastValueFrom, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleService {

  constructor(
    private http: HttpClient,
    private toastService: ToastService
  ) { }

  async getPlaceResult(place: string): Promise<any>{
    const response = await this.http.get<any>(`${environment.baseApiUrl}/googleproxy/search-place/${place}`)
    .pipe(
      catchError(() => {
        return of(null);
      })
    );

    const result = await lastValueFrom(response);

    if(!result){
      this.toastService.createErrorToast("Couldn't load places!");
      return;
    }

    return result;
  }
}
