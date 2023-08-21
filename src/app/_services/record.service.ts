import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CustomResponse } from '../_models/custom-response.model';
import { CostType } from '../_models/cost-type.model';
import { RecordType } from '../_models/record-type.model';
import { Category } from '../_models/category.model';
import { EstimateType } from '../_models/estimate-type.model';

@Injectable({
  providedIn: 'root'
})
export class RecordService {


    baseLink_costtype: string = `${environment.apiUrl}/api/cost_type`;
    baseLink_recordtype: string = `${environment.apiUrl}/api/record_type`;
    baseLink_category: string = `${environment.apiUrl}/api/category`;
    baseLink_estimateType: string = `${environment.apiUrl}/api/estimate_type`;

    constructor(private http: HttpClient) { }


    /** 
     * ======================================================== 
     * ================== Cost Type Services ==================
     * ========================================================
     */

    getCostTypes() {
        return this.http.get<CustomResponse>(`${this.baseLink_costtype}/get`);
    }

    saveCostType(costType: CostType) {
        return this.http.post<CustomResponse>(`${this.baseLink_costtype}/save`, costType);
    }

    updateCostType(costType: CostType) {
        return this.http.post<CustomResponse>(`${this.baseLink_costtype}/update`, costType);
    }

    deleteCostType(id: number) {
        return this.http.get<CustomResponse>(`${this.baseLink_costtype}/delete/${id}`);
    }

    deleteSelectedCostTypes(costTypes: CostType[]) {
        return this.http.post<CustomResponse>(`${this.baseLink_costtype}/delete/costtypes`, costTypes)
    }


    /** 
     * ======================================================== 
     * ================= Record Type Services =================
     * ========================================================
     */

    getRecordTypes() {
        return this.http.get<CustomResponse>(`${this.baseLink_recordtype}/get`);
    }

    saveRecordType(recordType: RecordType) {
        return this.http.post<CustomResponse>(`${this.baseLink_recordtype}/save`, recordType)
    }

    deleteRecordTypes(recordTypes: RecordType[]) {
        //console.log("RecordService::deleteRecordTypes:recordTypes:" + recordTypes.length);
        return this.http.post<CustomResponse>(`${this.baseLink_recordtype}/delete/recordtypes`, recordTypes)
    }

    deleteRecordType(id: number) {
        return this.http.get<CustomResponse>(`${this.baseLink_recordtype}/delete/${id}`)
    }

    updateRecordType(recordType: RecordType) {
        return this.http.post<CustomResponse>(`${this.baseLink_recordtype}/update`, recordType);
    }

    /**
     *  Retrive all Category objects
     *  
     */
    getCategories() {
        return this.http.get<CustomResponse>(`${this.baseLink_category}/get`);
    }

    updateCategory(category: Category) {
        return this.http.post<CustomResponse>(`${this.baseLink_category}/update`, category);
    }

    saveCategory(category: Category) {
        return this.http.post<CustomResponse>(`${this.baseLink_category}/save`, category)
    }

    deleteCategory(id: number) {
        return this.http.get<CustomResponse>(`${this.baseLink_category}/delete/${id}`);
    }

    deleteSelectedCategories(categories: Category[]) {
        return this.http.post<CustomResponse>(`${this.baseLink_category}/delete/categories`, categories);
    }

    /** 
     * ======================================================== 
     * ================= Estimate Type Services =================
     * ========================================================
     */

    getEstimateTypes() {
        return this.http.get<CustomResponse>(`${this.baseLink_estimateType}/get`);
    }

    updateEstimatedType(estimateType: EstimateType) {
        return this.http.post<CustomResponse>(`${this.baseLink_estimateType}/update`, estimateType);
    }

    saveEstimateType(estimateType: EstimateType) {
        return this.http.post<CustomResponse>(`${this.baseLink_estimateType}/save`, estimateType);
    }

    deleteEstimateType(id: number) {
        return this.http.get<CustomResponse>(`${this.baseLink_estimateType}/delete/${id}`);
    }

    deleteSelectedEstimateTypes(estimateTypes: EstimateType[]) {
        return this.http.post<CustomResponse>(`${this.baseLink_estimateType}/delete/estimatetypes`, estimateTypes);
    }

    /**
     *  Retrive all EstimateType objects
     *  
     */
    getFullEstimateType(id: number) {
        return this.http.get<CustomResponse>(`${this.baseLink_estimateType}/get/${id}`)
    }


}
