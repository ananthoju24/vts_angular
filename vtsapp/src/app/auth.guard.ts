import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(public authService: AuthService, public router: Router) { }

  canActivate() {
    console.log("Can activate ");
    if (this.authService.isLoggedIn()) {
      console.log("Can activate true");
      return true;
    } else {
      this.router.navigateByUrl('');
      console.log("Can activate false");
      return false;
    }
  }

}
