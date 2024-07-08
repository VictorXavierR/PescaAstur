import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { firebaseConfig } from '../environments/environment';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { CheckInComponent } from './check-in/check-in.component';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NavbarComponent } from './ui/navbar/navbar.component';

@NgModule({ declarations: [
        AppComponent,
        LoginComponent,
        PasswordResetComponent,
        CheckInComponent,
        NavbarComponent,
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
            ], 
    providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
