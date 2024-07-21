import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { firebaseConfig } from '../environments/environment';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { CheckInComponent } from './check-in/check-in.component';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NavbarComponent } from './ui/navbar/navbar.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import {ChartModule} from 'primeng/chart';
import { ProductlistComponent } from './productlist/productlist.component';



@NgModule({ declarations: [
        AppComponent,
        LoginComponent,
        PasswordResetComponent,
        CheckInComponent,
        NavbarComponent,
        UserprofileComponent,
        HomeComponent,
        MapComponent,
        ProductlistComponent,

    ],
    bootstrap: [AppComponent], 
    imports: [BrowserModule,
              AppRoutingModule,
              FormsModule,
              AngularFireAuthModule,
              AngularFireModule.initializeApp(firebaseConfig),
              BrowserAnimationsModule,
              BsDatepickerModule.forRoot(),
              AngularFirestoreModule,
              AngularFireStorageModule,
              ReactiveFormsModule,
              ChartModule,
            ], 
    providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
