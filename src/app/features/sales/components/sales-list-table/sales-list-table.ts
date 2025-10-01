import {Component, input} from '@angular/core';
import {DatePipe} from "@angular/common";
import {SaleInfoModel} from '../../../../core/models/sales/sale-info.model';

@Component({
  selector: 'app-sales-list-table',
    imports: [
        DatePipe
    ],
  templateUrl: './sales-list-table.html',
  styleUrl: './sales-list-table.css'
})
export class SalesListTable {

    sales = input.required<SaleInfoModel[]>();

}
