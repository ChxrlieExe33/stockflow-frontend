import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {Product} from '../../../core/models/products/product.model';

export type CategoriesPageResponse = {
    content: Category[],
    page: {
        number: number,
        size: number,
        totalElements: number,
        totalPages: number
    }
}

export type ProductPageResponse = {
    content: Product[],
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
export class CategoryService {

    constructor(private httpClient: HttpClient) {
    }

    public getAllCategories(page: number): Observable<CategoriesPageResponse> {

        const params = new HttpParams().append('page', page);

        return this.httpClient.get<CategoriesPageResponse>(`${environment.apiBaseUrl}/api/v1/products/categories`, {params});

    }

    public getCategoryDetail(categoryId: string): Observable<Category> {

        return this.httpClient.get<Category>(`${environment.apiBaseUrl}/api/v1/products/categories/${categoryId}`);

    }

    public getProductsBelongingToCategory(categoryId: string, page: number): Observable<ProductPageResponse> {

        const params = new HttpParams().append('page', page);

        return this.httpClient.get<ProductPageResponse>(`${environment.apiBaseUrl}/api/v1/products/category/${categoryId}`, {params});

    }

    public searchCategoriesByName(name : string): Observable<Category[]> {

        return this.httpClient.get<Category[]>(`${environment.apiBaseUrl}/api/v1/products/categories/search/${name}`);

    }

    public submitNewCategory(name: string): Observable<void> {

        const data = {
            categoryName: name
        }

        return this.httpClient.post<void>(`${environment.apiBaseUrl}/api/v1/products/categories`, data);

    }


    public updateCategory(categoryId: string, name: string): Observable<Category> {

        const data = {
            categoryName: name
        }

        return this.httpClient.put<Category>(`${environment.apiBaseUrl}/api/v1/products/categories/${categoryId}`, data)

    }

}
