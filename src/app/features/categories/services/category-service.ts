import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';

export type CategoriesPageResponse = {
    content: Category[],
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

    constructor(private httpClient: HttpClient) {}

    public getAllCategories(page : number) : Observable<CategoriesPageResponse> {

        const params = new HttpParams().append('page', page);

        return this.httpClient.get<CategoriesPageResponse>(`${environment.apiBaseUrl}/api/v1/products/categories`, {params});

    }

}
