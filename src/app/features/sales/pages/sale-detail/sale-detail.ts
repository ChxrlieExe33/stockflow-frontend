import {Component, input, OnInit, signal} from '@angular/core';
import {SaleInfoModel} from '../../../../core/models/sales/sale-info.model';
import {DatePipe} from '@angular/common';
import {CapitalizeFirstPipe} from '../../../../shared/pipes/capitalize-first.pipe';
import {SalesService} from '../../services/sales-service';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {InstanceData} from '../../../../core/models/sales/sale-product-instance-data.model';
import {takeUntil} from 'rxjs';
import {SaleProductInstancesTable} from '../../components/sale-product-instances-table/sale-product-instances-table';

@Component({
  selector: 'app-sale-detail',
    imports: [
        DatePipe,
        CapitalizeFirstPipe,
        SaleProductInstancesTable
    ],
    providers: [AutoDestroyService],
  templateUrl: './sale-detail.html',
  styleUrl: './sale-detail.css'
})
export class SaleDetail implements OnInit {

    // From the resolver and wired with component input binding.
    sale = input.required<SaleInfoModel>();

    saleProducts = signal<InstanceData[]>([]);

    error = signal<string | undefined>(undefined);

    constructor(private readonly saleService: SalesService,
                private readonly destroy$: AutoDestroyService) {}

    ngOnInit() {

        this.subscribeToSaleProducts();

    }

    subscribeToSaleProducts() {

        this.saleService.getSaleProducts(this.sale().orderId).pipe(takeUntil(this.destroy$)).subscribe({
            next: data => {

                this.saleProducts.set(data);

            }, error: error => {

                this.handleError(error);

            }
        })

    }

    handleError(err: any) {

        if (err.error && typeof err.error === 'object' && err.error.message) {
            console.log(err.error.message);
            this.error.set(err.error.message);
        } else {
            console.log(err);
            this.error.set("Something went wrong when fetching products, please try again later.");
        }

    }

}
