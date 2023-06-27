import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ToastService } from './toast.service';
import { catchError, lastValueFrom, of } from 'rxjs';
import { PlaceResult } from '../_interfaces/GooglePlace.modal';

@Injectable({
  providedIn: 'root'
})
export class GoogleService {

  constructor(
    private http: HttpClient,
    private toastService: ToastService
  ) { }

  async getPlaceResult(place: string): Promise<PlaceResult>{
    const response = this.http.get<any>(`${environment.baseApiUrl}/googleproxy/search-place/${place}`)
    .pipe(
      catchError((_) => {
        return of(null);
      })
    );

    const result = await lastValueFrom(response);

    if(!result){
      this.toastService.createErrorToast("Couldn't load places!");
      return {} as PlaceResult;
    }

    return result;
  }
}
