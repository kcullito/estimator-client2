import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CustomResponse } from '../_models/custom-response.model';
import { User } from '../_models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {


    baseLink: string = `${environment.apiUrl}/api/user`;

    constructor(private http: HttpClient) { }

    getUsers() {
        //console.log("UserService::getUsers:url:" + this.baseLink + "/get");
        return this.http.get<CustomResponse>(`${this.baseLink}/get`);
    }

    getUser(id: number) {
        return this.http.get<CustomResponse>(`${this.baseLink}/get/${id}`);
    }

    saveUser(user: User) {
        return this.http.post<CustomResponse>(`${this.baseLink}/save`, user);
    }

    deleteUser(id: number) {
        return this.http.get<CustomResponse>(`${this.baseLink}/delete/${id}`);
    }

    updateUser(user: User) {
        return this.http.post<CustomResponse>(`${this.baseLink}/update`, user);
    }

}
