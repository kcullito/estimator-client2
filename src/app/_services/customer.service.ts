import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CustomResponse } from '../_models/custom-response.model';
import { Customer } from '../_models/customer.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

    baseLink: string = `${environment.apiUrl}/api/customer`;
    baseEstimateLink: string = `${environment.apiUrl}/api/estimate`;

    constructor(private http: HttpClient) { }


    /** 
     * ======================================================= 
     * ================== Customer Services ==================
     * =======================================================
     */

    getCustomers(): Observable<any> {
        return this.http.get<CustomResponse>(`${this.baseLink}/get`);
    }

    getCustomer(id: number) {
        return this.http.get<CustomResponse>(`${this.baseLink}/get/${id}`);
    }

    saveCustomer(customer: Customer) {
        return this.http.post<CustomResponse>(`${this.baseLink}/save`, customer);
    }

    updateCustomer(customer: Customer) {
        return this.http.post<CustomResponse>(`${this.baseLink}/update`, customer);
    }

    deleteCustomer(id: number) {
        return this.http.get<CustomResponse>(`${this.baseLink}/delete/${id}`)
    }

    deleteFile(customerId: number, fileName: string) {
        return this.http.delete<CustomResponse>(`${this.baseLink}/delete/${customerId}/${fileName}`);
    }

    getEstimates(id: number) {
        return this.http.get<CustomResponse>(`${this.baseEstimateLink}/getByCustomer/${id}`);
    }
    
    /**
     * Get list of Customer files
     * 
     * @param id 
     * @returns 
     */
        getCustomerFiles(id: number) {
            //console.log("customerService::getCustomerFiles:" + `${this.baseLink}/files/${id}`);
            return this.http.get<CustomResponse>(`${this.baseLink}/files/${id}`);
        }
    
        /**
         * Get list of logo files
         * 
         * @returns 
         */
        getLogoFiles() {
            return this.http.get<CustomResponse>(`${this.baseLink}/logos`);
        }
    
        /**
         * Get list of banner files
         * 
         * @returns 
         */
        getBannerFiles() {
            return this.http.get<CustomResponse>(`${this.baseLink}/banners`);
        }

        downloadPdf(customer: Customer, filename: string, download: boolean) {
            let url = `${this.baseLink}files/${customer.id}/${filename}/${download}`;
            window.open(url);
        }
    
    
}
