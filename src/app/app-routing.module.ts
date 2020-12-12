import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth.guard';
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';


const routes: Routes = [
  {path:'' , redirectTo:'home',pathMatch:'full'},
  {path:'login',component:LoginComponent},
  {path:'home',component:HomeComponent,canActivate:[AuthGuard]},
  {path:'ticket/:id',component:TicketDetailsComponent,canActivate:[AuthGuard]},
  {
    path: "**",
    redirectTo: "/home",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
