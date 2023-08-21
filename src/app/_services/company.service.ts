import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CustomResponse } from '../_models/custom-response.model';
import { Company } from '../_models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

    baseLink: string = `${environment.apiUrl}/api/company`;

    constructor(private http: HttpClient) { }

    getCompanies() {
        return this.http.get<CustomResponse>(`${this.baseLink}/get`)
    }

    updateCompany(company: Company) {
        return this.http.post<CustomResponse>(`${this.baseLink}/update`, company);
    }

    saveCompany(company: Company) {
        return this.http.post<CustomResponse>(`${this.baseLink}/save`, company)
    }

    deleteCompany(id: number) {
        return this.http.get<CustomResponse>(`${this.baseLink}/delete/${id}`);
    }
}
