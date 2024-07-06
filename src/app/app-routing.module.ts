import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { LoginComponent } from './login/login.component';
import { CheckInComponent } from './check-in/check-in.component';

const routes: Routes = [
  {path:'login',component:LoginComponent},
  {path:'password-reset', component: PasswordResetComponent},
  {path:'check-in',component:CheckInComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
