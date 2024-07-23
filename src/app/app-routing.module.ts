import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { LoginComponent } from './login/login.component';
import { CheckInComponent } from './check-in/check-in.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { ProductlistComponent } from './productlist/productlist.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

const routes: Routes = [
  {path:'login',component:LoginComponent},
  {path:'password-reset', component: PasswordResetComponent},
  {path:'check-in',component:CheckInComponent},
  {path:'userprofile',component:UserprofileComponent},
  {path:'home',component:HomeComponent},
  {path:'map',component:MapComponent},
  {path:'productlist',component:ProductlistComponent},
  {path:'product-details',component:ProductDetailsComponent},
  {path:'**',redirectTo:'home'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
