import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {NewSaleModel} from '../../../core/models/sales/new-sale.model';
import {SaleInfoModel} from '../../../core/models/sales/sale-info.model';

export type SaleInfoPage = {
    content: SaleInfoModel[],
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
export class SalesService {

    constructor(private http: HttpClient) {}

    getSales(page: number, orderBy: 'ordered' | 'delivery'): Observable<SaleInfoPage> {

        const params = new HttpParams().append('page', page).append('orderBy', orderBy);

        return this.http.get<SaleInfoPage>(`${environment.apiBaseUrl}/api/v1/orders`, {params});

    }

    getSaleById(id: number): Observable<SaleInfoModel> {

        return this.http.get<SaleInfoModel>(`${environment.apiBaseUrl}/api/v1/orders/${id}`);

    }

    submitNewSale(sale: NewSaleModel) : Observable<void> {

        return this.http.post<void>(`${environment.apiBaseUrl}/api/v1/orders`, sale)

    }

}
