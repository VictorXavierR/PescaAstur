import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { firebaseConfig } from '../environments/environment';
import { PasswordResetComponent } from './password-reset/password-reset.component';

@NgModule({ declarations: [
        AppComponent,
        LoginComponent,
        PasswordResetComponent,
    ],
    bootstrap: [AppComponent], 
    imports: [BrowserModule,
              AppRoutingModule,
              FormsModule,
              AngularFireAuthModule,
              AngularFireModule.initializeApp(firebaseConfig)
            ], 
    providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
