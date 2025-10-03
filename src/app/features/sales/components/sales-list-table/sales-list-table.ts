import {Component, input} from '@angular/core';
import {DatePipe} from "@angular/common";
import {SaleInfoModel} from '../../../../core/models/sales/sale-info.model';
import {Router} from '@angular/router';

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

    constructor(private readonly router: Router) {}

    navigateToSaleDetail(id: string) {

        this.router.navigate(['/sales','detail', id]).then();

    }

}
