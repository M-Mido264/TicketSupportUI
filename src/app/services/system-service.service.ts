import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { LogLevel } from './LogService';
import * as log from './LogService';
import { LocalStorageService, LocalStorageDataType } from './LocalStorageService';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';
import { environment } from 'src/environments/environment';

@Injectable()
export class SystemServiceService {
    apiEndpoint:string
    headers: HttpHeaders
    authTocken: string

    constructor(private http: HttpClient, private logger: log.LogService, private localStorageService: LocalStorageService,
        private router: Router) {
        this.apiEndpoint = environment.baseUrl;
    }

    getAll(
        controllerName: string,
      ): Observable<any> {
        const controllerUrl = this.apiEndpoint + controllerName;
        return this.http
          .get(
            controllerUrl,
            { observe: 'response' }
          )
          .pipe(map(response => {
            if (response != null) {
              return response.body;
            }
          }),
            catchError(error => {
              return this.handleError(error);
            }));
    
      }
    
      clone<T>(c: T): T {
        const cloneObj = Object.assign({}, c);
        return cloneObj;
      }
    
      get(controllerName: string, id: number): Observable<any> {
        const controllerUrl = this.apiEndpoint + controllerName + '/' + id;
        return this.http
          .get(controllerUrl, { observe: 'response' }).pipe(
            map(response => {
              if (response != null) {
                return response.body;
              }
            }),
            catchError(error => {
              return this.handleError(error);
            })
          );
      }
    
      delete(controllerName: string, id: number): Observable<any> {
        const controllerUrl = this.apiEndpoint + controllerName + '/' + id;
        return this.http
          .delete(controllerUrl, { observe: 'response' }).pipe(
            map(response => {
              if (response != null) {
                this.logger.pop(LogLevel.Success, 'Deleting Done Successfully');
                return response.body;
              }
            }),
            catchError(error => {
              return this.handleError(error);
            })
          );
      }
    
      post(
        controllerName: string,
        value: any,
        popUp: boolean = true
      ): Observable<any> {
    
        const User = this.localStorageService.LoadFromLocalStorage(
          LocalStorageDataType.UserInfo
        );
        const controllerUrl = this.apiEndpoint + controllerName;
        return this.http
          .post(controllerUrl, value, { observe: 'response' }).pipe(
            map(response => {
    
              if (response.ok) {
    
                if (popUp) {
                  this.logger.pop(LogLevel.Success, 'Adding Done Successfully');
                }
                return response.body;
              }
            }),
            catchError(error => {
              return this.handleError(error);
            })
          );
    
      }
    
      update(controllerName: string, value: any): Observable<any> {
        const controllerUrl = this.apiEndpoint + controllerName;
        return this.http
          .put(controllerUrl, value, { observe: 'response' })
          .pipe(map(response => {
            if (response.ok) {
              this.logger.pop(LogLevel.Success,'Edit Done Successfully');
              return response.body;
            }
          }),
            catchError(error => {
              return this.handleError(error);
        }));
      }
    
      private handleError(error: HttpErrorResponse) {
        // tslint:disable-next-line:no-debugger
        debugger;
        const message = error.error;
        if (error.status === 900) {
          this.localStorageService.DestroyUserData();
          this.router.navigate(['login']);
          this.logger.pop(LogLevel.Error, message);
        } else if (message && message.message) {
            this.logger.pop(LogLevel.Error, message);
          console.log(error);
        }
        // return Observable.throw(error);
        return throwError(error);
      }
}
