import { Injectable } from '@angular/core';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user !: User
  constructor() {

   }

  setUser(user: User){
    this.user = user;
  }
  getUser(){
    return this.user;
  }
}
