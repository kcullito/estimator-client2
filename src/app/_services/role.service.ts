import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CustomResponse } from '../_models/custom-response.model';
import { Role } from '../_models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {


    baseLink: string = `${environment.apiUrl}/api/role`;

    constructor(private http: HttpClient) { }

    getRoles() {
        //console.log("RoleService::getRoles:url:" + this.baseLink + "/get");
        return this.http.get<CustomResponse>(`${this.baseLink}/get`);
    }

}
