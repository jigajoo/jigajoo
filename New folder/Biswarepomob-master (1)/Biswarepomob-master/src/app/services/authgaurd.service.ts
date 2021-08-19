import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthgaurdService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
     console.log(this.authService.isLogin()," 133333333");
    var islogin = this.authService.isLogin();
    if(islogin){
        console.log(this.authService.isLogin()," 166666666666666666666");
        if (this.authService.isLogin() === 'true') {
          console.log(this.authService.isLogin()," 1888888888888888888888");
          return true;
        }
        else { 
          console.log(this.authService.isLogin()," 2222222222222222222222222222");
          this.router.navigate(['splash']);
          return false;
        }
      }else{
      console.log(this.authService.isLogin()," 45555555555555555555555");
      this.router.navigate(['splash']);
        return false;
    }
  }
}


@Injectable({
  providedIn: 'root'
})
export class OuterAuthgaurdService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
     console.log(this.authService.isLogin()," 133333333");
    var islogin = this.authService.isLogin();
    if(islogin){
      console.log(this.authService.isLogin()," 366666666666666");
      if (islogin === 'false') {
        return true;
      }
      else { 
        this.router.navigate(['home']);
        return false;
      }
    }else{
      console.log(this.authService.isLogin()," 45555555555555555555555");
      this.router.navigate(['splash']);
        return false;
    }
    
  }
}
