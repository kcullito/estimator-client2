import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Customer } from '../_models/customer.model';
import { CustomResponse } from '../_models/custom-response.model';

@Injectable({
  providedIn: 'root'
})
export class ScraperService {

    baseLink: string = `${environment.apiUrl}/api/scraper`;

    constructor(private http: HttpClient) { }

    getSalesTax(customer: Customer) {
        return this.http.post<CustomResponse>(`${this.baseLink}/salesTax`, customer);
    }


}
