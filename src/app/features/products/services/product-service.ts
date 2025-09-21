import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CreateProductModel} from '../../../core/models/products/create-product.model';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {Product} from '../../../core/models/products/product.model';

export type ProductCount = {
    width: number | null,
    length: number | null,
    height: number | null,
    colour: string | null,
    count: number,
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

    constructor(private http: HttpClient) {}

    public createNewProduct(product: CreateProductModel): Observable<void> {

        return this.http.post<void>(`${environment.apiBaseUrl}/api/v1/products`, product);
    }

    public getProductDetail(id: string): Observable<Product> {

        return this.http.get<Product>(`${environment.apiBaseUrl}/api/v1/products/${id}`);

    }

    public getCountsOfProduct(id: string): Observable<ProductCount[]> {

        return this.http.get<ProductCount[]>(`${environment.apiBaseUrl}/api/v1/product-instances/count-by-product/${id}`);

    }
}
