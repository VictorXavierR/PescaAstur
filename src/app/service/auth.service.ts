import { Injectable } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { firebaseConfig } from "../../environments/environment";
import firebase from 'firebase/compat/app';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) {
   }

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }
  logout(): Promise<any> {
    return this.afAuth.signOut();
  }
  sendPasswordReset(email: string): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email);
  }
  loginWithGoogle() {
    return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  loginWithFacebook() {
    return this.afAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }

  loginWithTwitter() {
    return this.afAuth.signInWithPopup(new firebase.auth.TwitterAuthProvider());
  }
}
