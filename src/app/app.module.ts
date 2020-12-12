import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './services/auth.guard';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './services/AuthService';
import { LogService } from './services/LogService';
import { LocalStorageService } from './services/LocalStorageService';
import { SystemServiceService } from './services/system-service.service';
import { RequestInterceptorService } from './services/RequestInterceptor';
import { environment } from 'src/environments/environment';
import { MaterialModule } from 'src/material-module';
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    TicketDetailsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ToastrModule.forRoot()
  ],
  providers: [
    AuthGuard,
    AuthService,
    LogService,
    LocalStorageService,
    SystemServiceService,
    ToastrService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptorService,
      multi: true
    },
    {
      provide: 'BASE_URL',
      useValue: environment.serverUrl
    },
    {
      provide: 'URL',
      useValue: environment.baseUrl
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
