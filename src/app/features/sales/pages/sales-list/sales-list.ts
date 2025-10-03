import {Component, OnInit, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {SaleInfoPage, SalesService} from '../../services/sales-service';
import {SaleInfoModel} from '../../../../core/models/sales/sale-info.model';
import {SalesListTable} from '../../components/sales-list-table/sales-list-table';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-sales-list',
    imports: [
        RouterLink,
        SalesListTable,
        NgClass
    ],
  templateUrl: './sales-list.html',
  styleUrl: './sales-list.css'
})
export class SalesList implements OnInit {

    protected currentLoadedSales = signal<SaleInfoModel[]>([]);
    protected currentPage = signal<number>(0);

    protected nextPageExists = signal<boolean>(false);
    protected prevPageExists = signal<boolean>(false);

    protected orderBy = signal<'delivery' | 'ordered'>('ordered');

    protected error = signal<string | undefined>(undefined);

    constructor(private salesService: SalesService) { }

    ngOnInit() {

        this.getSales(this.currentPage());

    }

    getSales(page: number) {

        this.salesService.getSales(page, this.orderBy()).subscribe({
            next: res => {

                this.currentLoadedSales.set(res.content);
                this.handlePagination(res, page);

            }, error: err => {
                this.handleError(err);
            }
        })

    }

    toggleOrder(){

        if (this.orderBy() === 'delivery') {

            this.orderBy.set('ordered');
        } else {

            this.orderBy.set('delivery');
        }

        this.getSales(0);

    }

    handleError(err: any) {

        if (err.error && typeof err.error === 'object' && err.error.message) {
            console.log(err.error.message);
            this.error.set(err.error.message);
        } else {
            console.log(err);
            this.error.set("Something went wrong when fetching sales, please try again later.");
        }

    }

    handlePagination(data: SaleInfoPage, page: number) {

        this.currentLoadedSales.set(data.content);
        this.currentPage.set(page);

        if (this.currentPage() + 1 >= data.page.totalPages) {
            this.nextPageExists.set(false);
        } else {
            this.nextPageExists.set(true);
        }

        if (this.currentPage() === 0) {
            this.prevPageExists.set(false);
        } else {
            this.prevPageExists.set(true);
        }

    }

}
