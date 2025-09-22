import {Component, input, OnInit, signal} from '@angular/core';
import {Product} from '../../../../core/models/products/product.model';
import {ProductDetailHeader} from '../../components/product-detail-header/product-detail-header';
import {ProductCount, ProductService} from '../../services/product-service';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {takeUntil} from 'rxjs';
import {CapitalizeFirstPipe} from '../../../../shared/pipes/capitalize-first.pipe';

@Component({
  selector: 'app-product-detail',
    imports: [
        ProductDetailHeader,
        CapitalizeFirstPipe
    ],
    providers: [AutoDestroyService],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit {

    product = input.required<Product>();
    counts = signal<ProductCount[]>([]);

    error = signal<string | undefined>(undefined);

    constructor(private readonly productService: ProductService, private readonly destroy$: AutoDestroyService) {
    }

    ngOnInit() {

        this.getProductCounts()
    }


    getProductCounts(){

        this.productService.getCountsOfProduct(this.product().productId).pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: data => {

                const sorted = this.sortCounts(data);

                this.counts.set(sorted);

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
            this.error.set("Something went wrong when getting the product counts, please try again later.");
        }

    }

    sortCounts(counts : ProductCount[]) : ProductCount[] {

        if (this.product().groupByColour) {

            return counts.sort((a, b) => a.colour!.toLowerCase().localeCompare(b.colour!.toLowerCase()));

        }

        if (this.product().groupByWidth) {

            return counts.sort(((a, b) => a.width! - b.width!));

        }

        if (this.product().groupByLength) {

            return counts.sort(((a, b) => a.width! - b.width!));

        }

        return counts;

    }

}
