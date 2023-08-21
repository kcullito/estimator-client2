import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { AuthenticationService } from "../_services/authentication.service";
import { StorageService } from "../_services/storage.service";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(
        private authenticationService: AuthenticationService,
        public storage: StorageService
    ) {}

    /**
     * Intercepts the http request and inserts the secure token in the header
     * This is required to access the protected backend API services
     * 
     * @param request HttpRequest to backend API
     * @param next HttpHandler
     */
        intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
            //console.log("JwtInterceptor::intercept:attempting to validate user")

            const currentUser = this.storage.getUser();
            if (currentUser && currentUser.token) {
                //console.log("JwtInterceptor::intercept:user is valid")
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${currentUser.token}`
                    }
                });
                //console.log("JwtInterceptor::intercept:added token.")
            }
            return next.handle(request);
        }
    

}
