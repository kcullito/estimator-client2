import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CustomResponse } from '../_models/custom-response.model';
import { User } from '../_models/user.model';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

    baseLink: string = `${environment.apiUrl}/api/auth`;

    constructor(private http: HttpClient) { }

    login(email: string, password: string) {
        return this.http.post<CustomResponse>(`${this.baseLink}/login`, {email, password})
    }

    login$ = (email:string, password:string) => <Observable<CustomResponse>>
        this.http.post<CustomResponse>(`${this.baseLink}/authenticate`, {email, password})
        .pipe(
            tap(console.log),
            catchError(this.handleErrors)
    )

    registerUser(user: User) {
        return this.http.post<CustomResponse> (`${this.baseLink}/register`, {user});
    }

    

    private handleErrors(error: HttpErrorResponse): Observable<never> {
        console.log("AuthenticationService::error:" + error)
        return throwError(() => new Error(`An error occured - Error code: ${error.status}`));
    }
    
}
