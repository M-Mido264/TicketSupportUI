import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpSentEvent,
  HttpProgressEvent
} from "@angular/common/http";
import {
  HttpRequest,
  HttpHandler,
  HttpHeaderResponse,
  HttpResponse,
  HttpUserEvent,
  HttpErrorResponse
} from "@angular/common/http";
import { AuthService } from "./AuthService";
import { Injector } from "@angular/core";
import { Router } from "@angular/router";
import { HttpEventType } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/internal/operators/tap';
@Injectable()
export class RequestInterceptorService implements HttpInterceptor {
  constructor(
    private current_path: ActivatedRoute,
    private injector: Injector,
    private router: Router,
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<
    | HttpSentEvent
    | HttpHeaderResponse
    | HttpProgressEvent
    | HttpResponse<any>
    | HttpUserEvent<any>
  > {
    let authService = <AuthService>this.injector.get(AuthService);
    //  before request sent
    let new_req = authService.AuthTokenAsHeader
      ? req.clone({
          headers: req.headers
            .set("Authorization", authService.AuthTokenAsHeader)
            .set("Accept", "application/json")
        })
      : req;

    // can show spinner here

    return next.handle(new_req).pipe(
      tap(
        event => {
          if (event.type === HttpEventType.Response) {
            // hide spinner
          }
        },
        (error: HttpErrorResponse) => {
          if (error.status === 401) {
            authService.Logout();
          }
        }
      )
    )   
  }
}
