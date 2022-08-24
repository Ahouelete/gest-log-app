import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalService } from './globalService';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private _globalService: GlobalService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    if (this._globalService.getToken()) {
      request = request.clone({
        setHeaders: {
          authorization: `Bearer ${this._globalService.getToken()}`
        }
      });
    }

    return next.handle(request);
  }
}
