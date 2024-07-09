import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { LoginComponent } from './login/login.component';
import { CheckInComponent } from './check-in/check-in.component';
import { UserprofileComponent } from './userprofile/userprofile.component';

const routes: Routes = [
  {path:'login',component:LoginComponent},
  {path:'password-reset', component: PasswordResetComponent},
  {path:'check-in',component:CheckInComponent},
  {path:'userprofile',component:UserprofileComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
