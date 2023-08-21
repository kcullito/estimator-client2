import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CustomResponse } from '../_models/custom-response.model';
import { Estimate } from '../_models/estimate.model';
import { EstimateStatus } from '../_models/estimate-status.model';
import { EstimateDetail } from '../_models/estimate-detail.model';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstimateService {

    baseLink: string = `${environment.apiUrl}/api/estimate`;
    //baseDetailLink: string = `${environment.apiUrl}/api/estimate`;

    constructor(private http: HttpClient) { }

    
    getEstimate(id: number) {
        return this.http.get<CustomResponse>(`${this.baseLink}/get/${id}`);
    }

    getEstimateByUser(id: number) {
        return this.http.get<CustomResponse>(`${this.baseLink}/getByUser/${id}`);
    }

    getEstimates() {
        return this.http.get<CustomResponse>(`${this.baseLink}/get`);
    }

    getFullEstimates() {
        return this.http.get<CustomResponse>(`${this.baseLink}/get/full`);
    }

    saveEstimate(estimate: Estimate) {
        return this.http.post<CustomResponse>(`${this.baseLink}/save`, estimate);
    }

    updateEstimate(estimate: Estimate) {
        return this.http.post<CustomResponse>(`${this.baseLink}/update`, estimate);
    }

    updateEstimate$ = (estimate:Estimate) => <Observable<CustomResponse>>
    this.http.post<CustomResponse>(`${this.baseLink}//update`, {estimate})
    .pipe(
        tap(console.log),
        catchError(this.handleErrors)
    )

    updateEstimateDetail(estimateDetail:EstimateDetail) {
        return this.http.post<CustomResponse>(`${this.baseLink}/update_detail`, estimateDetail);
    }

    deleteEstimate(id: number) {
        return this.http.get<CustomResponse>(`${this.baseLink}/delete/${id}`);
    }

    addNewVersion(estimate: Estimate) {
        return this.http.post<CustomResponse>(`${this.baseLink}/newVersion`, estimate);
    }

    /*********************************
     * Estimate Status Calls
     *********************************/

    deleteEstimateDetail(id: number) {
        return this.http.get<CustomResponse>(`${this.baseLink}/delete_detail/${id}`);
    }

    saveEstimateDetail(estimateDetail: EstimateDetail) {
        return this.http.post<CustomResponse>(`${this.baseLink}/saveDetail`, estimateDetail);
    }


    /*********************************
     * Estimate Status Calls
     *********************************/

    getEtimateStatuses() {
        return this.http.get<CustomResponse>(`${this.baseLink}/get_statuses`);
    }

    saveEstimateStatus(estimateStatus: EstimateStatus) {
        return this.http.post<CustomResponse>(`${this.baseLink}/save_status`, estimateStatus);
    }

    updateEstimateStatus(estimateStatus: EstimateStatus) {
        return this.http.post<CustomResponse>(`${this.baseLink}/update_status`, estimateStatus);
    }

    deleteEstimateStatus(id: number) {
        return this.http.get<CustomResponse>(`${this.baseLink}/delete_status/${id}`);
    }

    deleteSelectedEstimateStatuses(estimateStatuses: EstimateStatus[]) {
        return this.http.post<CustomResponse>(`${this.baseLink}/delete/estimatestatuses`, estimateStatuses);
    }

    
    
    
    /**
     * Generate an Estimate document
     * 
     * @param id 
     * @returns 
     */
    generateEstimate(id: number, tmp: number, version: number) {
        return this.http.get(`${this.baseLink}/generate/${id}/${tmp}/${version}`);
    }


    private handleErrors(error: HttpErrorResponse): Observable<never> {
        console.log("AuthenticationService::error:" + error)
        return throwError(() => new Error(`An error occured - Error code: ${error.status}`));
    }


}
