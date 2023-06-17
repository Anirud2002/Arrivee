import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, filter, map, take, throwError } from 'rxjs';
import { User } from '../_interfaces/Auth.modal';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../_services/toast.service';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
    ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currentUser: User;
    this.authService.user$.pipe(take(1)).subscribe(user => currentUser = user);

    if(currentUser){
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      })
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        switch(error.status){
          case 401: // unauthorized
            this.router.navigateByUrl("login");
            this.toastService.createErrorToast("Unauthorized!");
            break;
          case 500: // backend error
            this.toastService.createErrorToast("Something went wrong!");
            break;
          default:
            this.toastService.createErrorToast(error.error.message);
            break;
        }
        return throwError(() => new Error(error.message));
      })
    );
  }
}
