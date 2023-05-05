import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators'
import { ToastrService } from 'ngx-toastr';
import { ShareDataService } from '../services/share-data.service';
import { BasicService } from '../services/basic.service'
@Injectable({
  providedIn: 'root',
})
export class HttpConfig implements HttpInterceptor {

  service_count = 0; // initialize the counter.
  accessToken: any = JSON.parse(localStorage.getItem("authData"));

  constructor(
    private shareDataService: ShareDataService,
    private tosterService: ToastrService,
    private basicService: BasicService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.sendRequest(req, next);
  }

  sendRequest(
    req: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {

    const authData = JSON.parse(localStorage.getItem('authData'));

    if (authData)
      req = this.addBearerAndHeaders(req, authData.accessToken)

    this.service_count++;
    if (this.shareDataService.loaderHack) {
      this.shareDataService.showHideLoader(true);
    }

    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.service_count--;

          if (this.service_count === 0)
            this.shareDataService.showHideLoader(false);
        }
        return event;
      }),
      catchError(err => {
        this.service_count--;

        if (this.service_count === 0)
          this.shareDataService.showHideLoader(false);

        if (err.status == 401 && this.accessToken) {
          return this.handleRefrehToken(req, next);
        } else {
          let errMsg = err.error.message ? err.error.message : err.error.errorMsg;
          this.tosterService.error(errMsg);
          return throwError(err);
        }
      }));
  }

  addBearerAndHeaders(req: HttpRequest<any>, accessToken: string) {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  handleRefrehToken(request: HttpRequest<any>, next: HttpHandler) {
    let parameters = {
      sessionKey: this.accessToken.sessionKey,
      refreshToken: this.accessToken.refreshToken,
      token: this.accessToken.accessToken
    };

    return this.basicService.post('user/refresh', parameters)
      .pipe(
        switchMap((data: any) => {
          const payload = data.payload;
          if (payload.accessToken) {
            this.shareDataService.settingUserData(payload);
            return next.handle(this.addBearerAndHeaders(request, payload.accessToken));
          }
          return throwError('Unauthorized Access. Please login again.');
        }),
        catchError((error: any) => {
          let msg = 'Unauthorized Access. Please login again.';
          if (error.errorMsg)
            msg = error.errorMsg;

          this.tosterService.error(msg);
          this.shareDataService.logout();
          return throwError(msg);
        })
      );
  }

}
