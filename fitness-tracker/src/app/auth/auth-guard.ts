import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad{
    constructor(private authService: AuthService, private router: Router){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
         if(this.authService.isAuth()){
             return true;
         }else {
             this.router.navigate(['/login']);
         }
    }

    canLoad(route: Route) {
        if(this.authService.isAuth()){
            return true;
        }else {
            this.router.navigate(['/login']);
        }
   }

}