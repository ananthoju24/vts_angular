import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  
  public isLoggedIn(){
    return localStorage.getItem('Auth-Token');
  }
  public logout(){
    localStorage.removeItem('Auth-Token');
  }

  public getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
}
