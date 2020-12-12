import { Injectable } from "@angular/core";
import {
  LocalStorageService,
  LocalStorageDataType
} from "./LocalStorageService";
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse
} from "@angular/common/http";
import { Router } from "@angular/router";
import { User } from "../models/User";
import { environment } from "src/environments/environment";

export class AuthTokenReponse {
  [x: string]: any;
  public access_token: string;
  public expires_in: string;
  public token_type: string;
  public userId: string;
  public userName: string;
  public roles: any[] = [];
}

@Injectable()
export class AuthService {
  private BaseUrl = environment.serverUrl;
  public get IsAdmin() {
    if (!this.TokenContainer) return false;

    return (
      this.TokenContainer.roles &&
      this.TokenContainer.roles.indexOf("Administrator") > -1
    );
  }

  private _User: User;

  get User() {
    return (
      this._User ||
      this.localStorageService.LoadFromLocalStorage(
        LocalStorageDataType.UserInfo
      )
    );
  }

  set User(user: User) {
    this._User = user;
    this.localStorageService.AddToLocalStorage(
      user,
      LocalStorageDataType.UserInfo);
  }

  constructor(
    private localStorageService: LocalStorageService,
    private http: HttpClient,
    private router: Router,
  ) {
    
  }

  // return token container object from local storage
  private get TokenContainer(): AuthTokenReponse {
    return this.localStorageService.LoadFromLocalStorage(
      LocalStorageDataType.AuthToken)
  }

  // indicates if there is any token in localstorage
  // Note : Even if there is a token in localstorgae it may be expired
  // ang that  will be discovered when making any request with a service
  // unauthorized reponse will be returned when expired
  public get IsAuthenticated(): boolean {
    return this.TokenContainer && this.TokenContainer.access_token
      ? true
      : false;
    //return true;
  }

  // return token from storage in form : "Bearer xxxxxx"
  public get AuthTokenAsHeader(): string | null {
    return this.TokenContainer
      ? "Bearer " + this.TokenContainer.access_token
      : null;
  }

  /**
   * Authenticate Used to log the user in system and return token as reponse
   * which will be saved in localstorage
   */
  public Login(
    user: any,
    successCallback: Function,
    errorCallback: Function
  ) {
    let headers = {
      "Content-Type": "application/json"
    };

    let login_observable = this.http.post(
      `${this.BaseUrl}user/Login`,
      {
        username: user.UserName,
        password: user.Password
      },

      { headers, observe: "response" }
    );

    login_observable.subscribe(
      (resp: HttpResponse<AuthTokenReponse>) => {
        if (resp.ok) {
          // store token in storage
          this.localStorageService.AddToLocalStorage(
            resp.body,
            LocalStorageDataType.AuthToken
          );
          this.User = resp.body.UserInfo;
          if (successCallback) { successCallback(resp); }
        }
      },
      (error: HttpErrorResponse) => {
        if (errorCallback) errorCallback(error);
      }
    );
  }
  /**
   * Logout the user and clear local storage tokens
   */
  public Logout() {
    this.localStorageService.DestroyUserData();
    this.router.navigate(["login"]);
  }
}
