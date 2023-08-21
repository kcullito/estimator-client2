import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "../_services/authentication.service";
import { Observable, catchError, throwError } from "rxjs";
import { StorageService } from "../_services/storage.service";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    //route: ActivatedRouteSnapshot
    //state: RouterStateSnapshot

    constructor(
        private authenticationService: AuthenticationService,
        private storage: StorageService,
        public router: Router,
        private route: ActivatedRoute,
        //private state: RouterStateSnapshot

    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const currentUser = this.storage.getUser();
        return next.handle(request).pipe(catchError(err => {
            if ([401, 403].includes(err.status) && currentUser && currentUser.token) {
                // auto logout if 401 or 403 response returned from api
                //this.authenticationService.login(currentUser.email, currentUser.password);
                //console.log("ErrorInterceptor::route:" + request.urlWithParams);
                //this.router.navigate(['login'], { queryParams: { returnUrl: this.state.url }});
                this.router.navigate(['login']);
            //} else {
            //    this.router.navigate(['login']);
            }

            const error = err.error?.message || err.statusText;
            console.error(err);
            return throwError(() => error);
        }))
    }
}
