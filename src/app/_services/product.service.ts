import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomResponse } from '../_models/custom-response.model';
import { Product } from '../_models/products/product.model';
import { ProductBrand } from '../_models/products/product-brand.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

    baseLink: string = `${environment.apiUrl}/api/product`;

    constructor(private http: HttpClient) { }

    /*************************
     *     Product Calls     *
     *************************/

    getProducts(): Observable<any> {
        return this.http.get<CustomResponse>(`${this.baseLink}/get`);
    }

    getProduct(id: number) {
        return this.http.get<CustomResponse>(`${this.baseLink}/get/${id}`);
    }

    saveProduct(product: Product) {
        return this.http.post<CustomResponse>(`${this.baseLink}/save`, product);
    }

    deleteProduct(id: number) {
        return this.http.get<CustomResponse>(`${this.baseLink}/delete/${id}`);
    }

    updateProduct(product: Product) {
        return this.http.post<CustomResponse>(`${this.baseLink}/update`, product);
    }

    /******************************
     *     Product Brand Calls     *
     ******************************/

    getProductBrands(): Observable<any> {
        return this.http.get<CustomResponse>(`${this.baseLink}/brand/get`);
    }

    getProductBrand(id: number) {
        return this.http.get<CustomResponse>(`${this.baseLink}/brand/get/${id}`);
    }

    saveProductBrand(productBrand: ProductBrand) {
        return this.http.post<CustomResponse>(`${this.baseLink}/brand/save`, productBrand);
    }

    deleteProductBrand(id: number) {
        return this.http.get<CustomResponse>(`${this.baseLink}/brand/delete/${id}`);
    }

    updateProductBrand(productBrand: ProductBrand) {
        return this.http.post<CustomResponse>(`${this.baseLink}/brand/update`, productBrand);
    }



}
