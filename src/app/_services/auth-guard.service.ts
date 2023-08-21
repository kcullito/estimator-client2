import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
    constructor(
        public router: Router,
        public storage: StorageService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!this.storage.validToken()) {
            this.router.navigate(['login'], { queryParams: { returnUrl: state.url }});
            console.log("AuthGuardService::canActivate:Token NOT valid:" + state.url)
            return false;
        }
        //console.log("AuthGuardService::canActivate:Token is valid:" + state.url);
        return true;
    }


    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // not logged in so redirect to login page with the return url
        if (!this.storage.validToken()) {
            this.router.navigate(['login'], { queryParams: { returnUrl: state.url }});
            console.log("AuthGuardService::canActivateChild:Token NOT valid:" + state.url)
            return false;
        }
        //console.log("AuthGuardService::canActivateChild:Token is valid:" + state.url)
        return true;

    }
}
