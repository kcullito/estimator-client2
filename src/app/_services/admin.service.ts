import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CustomResponse } from '../_models/custom-response.model';
import { Role } from '../_models/role.model';
import { User } from '../_models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

    baseLink: string = `${environment.apiUrl}/api/admin`;
    adminLink: string = `${environment.apiUrl}/api/auth`;

    constructor(private http: HttpClient) { }

    saveRole(role: Role) {
        console.log("RoleService:saveRole:role:" + role.authority);
        return this.http.post<CustomResponse>(`${this.baseLink}/save_role`, role);
    }

    registerUser(user: User) {
        return this.http.post<CustomResponse>(`${this.adminLink}/register`, user);
    }

    deleteUser(id: number) {
        return this.http.get<CustomResponse>(`${this.baseLink}/delete/${id}`);
    }

    updateUserRoles(id: number, roles: Role[]) {
        return this.http.post<CustomResponse>(`${this.baseLink}/update_roles/${id}`, roles);
    }
}
