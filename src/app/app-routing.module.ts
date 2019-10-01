import { AuthGuard } from './guards/auth.guard';
import { SingUpComponent } from './auth/sing-up/sing-up.component';
import { AuthComponent } from './auth/auth.component';
import { AppwelcomeComponent } from './appwelcome/appwelcome.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {path: '',component: AppwelcomeComponent,canActivate: [AuthGuard]},
  {path: 'login',component: AuthComponent},
  {path: 'signup',component: SingUpComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
