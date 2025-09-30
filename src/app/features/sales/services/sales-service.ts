import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {NewSaleModel} from '../../../core/models/sales/new-sale.model';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

    constructor(private http: HttpClient) {}

    submitNewSale(sale: NewSaleModel) : Observable<void> {

        return this.http.post<void>(`${environment.apiBaseUrl}/api/v1/orders`, sale)

    }

}
