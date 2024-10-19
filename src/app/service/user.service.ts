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
    if(this.user){
      return this.user;
    }else{
      this.user = new User();
      return this.user;
    }

    
  }
}
