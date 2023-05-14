import { Injectable } from "@angular/core";
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
  } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ResponseModalErrorComponent } from "../response-modal-error/response-modal-error.component";
  
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor{
constructor() {}
intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
    .pipe(catchError((err) => {
        return throwError(() => err)
    }))
  }
}
