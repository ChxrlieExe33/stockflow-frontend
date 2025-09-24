import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CreateProductModel} from '../../../core/models/products/create-product.model';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {Product} from '../../../core/models/products/product.model';
import {ProductInstance} from '../../../core/models/products/product-instance.model';

export type ProductCount = {
    width: number | null,
    length: number | null,
    height: number | null,
    colour: string | null,
    count: number,
}

export type ProductSearchResult = {
    name: string,
    factoryName: string,
    productId: string,
}

export type ProductInstancesPage = {
    content: ProductInstance[],
    page: {
        number: number,
        size: number,
        totalElements: number,
        totalPages: number
    }
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

    public searchByName(productName: string): Observable<ProductSearchResult[]> {

        return this.http.get<ProductSearchResult[]>(`${environment.apiBaseUrl}/api/v1/products/search-summary/${productName}`);

    }

    public getInstancesByProduct(id: string, page: number): Observable<ProductInstancesPage> {

        const params = new HttpParams().append('page', page);

        return this.http.get<ProductInstancesPage>(`${environment.apiBaseUrl}/api/v1/product-instances/by-root-product/${id}`, {params});

    }

}
