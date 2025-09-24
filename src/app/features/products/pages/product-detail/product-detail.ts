import {Component, input, OnInit, signal} from '@angular/core';
import {Product} from '../../../../core/models/products/product.model';
import {ProductDetailHeader} from '../../components/product-detail-header/product-detail-header';
import {ProductCount, ProductInstancesPage, ProductService} from '../../services/product-service';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {takeUntil} from 'rxjs';
import {ProductCounts} from '../../components/product-counts/product-counts';
import {ProductInstance} from '../../../../core/models/products/product-instance.model';
import {ProductInstances} from '../../components/product-instances/product-instances';
import {NgClass} from '@angular/common';

enum ViewMode {
    COUNTS,
    INSTANCES
}

@Component({
  selector: 'app-product-detail',
    imports: [
        ProductDetailHeader,
        ProductCounts,
        ProductInstances,
        NgClass,
    ],
    providers: [AutoDestroyService],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit {

    // Obtained from component input binding.
    product = input.required<Product>();

    counts = signal<ProductCount[]>([]);

    instances = signal<ProductInstance[]>([]);
    currentInstancePage = signal<number>(0);
    previousInstancePageExists = signal<boolean>(false);
    nextInstancePageExists = signal<boolean>(false);

    countsError = signal<string | undefined>(undefined);

    instancesError = signal<string | undefined>(undefined);

    mode = signal<ViewMode>(ViewMode.COUNTS);

    constructor(private readonly productService: ProductService, private readonly destroy$: AutoDestroyService) {
    }

    ngOnInit() {

        this.getProductCounts()
        this.getFirstProductInstances()
    }


    getProductCounts(){

        this.productService.getCountsOfProduct(this.product().productId).pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: data => {

                const sorted = this.sortCounts(data);

                this.counts.set(sorted);

            }, error: error => {

                this.handleCountsError(error);

            }
        })

    }

    handleCountsError(err: any) {

        if (err.error && typeof err.error === 'object' && err.error.message) {
            console.log(err.error.message);
            this.countsError.set(err.error.message);
        } else {
            console.log(err);
            this.countsError.set("Something went wrong when getting the product counts, please try again later.");
        }

    }

    handleInstancesError(err: any) {

        if (err.error && typeof err.error === 'object' && err.error.message) {
            console.log(err.error.message);
            this.instancesError.set(err.error.message);
        } else {
            console.log(err);
            this.instancesError.set("Something went wrong when getting the product counts, please try again later.");
        }

    }



    changeToInstancesPage() {

        this.mode.set(ViewMode.INSTANCES)
    }

    changeToCountsPage() {

        this.mode.set(ViewMode.COUNTS)
    }

    getFirstProductInstances() {

        this.productService.getInstancesByProduct(this.product().productId, 0).pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: data => {

                this.handleInstancesPagination(data, this.currentInstancePage());

            }, error: error => {

                this.handleInstancesError(error);
            }
        })

    }

    getProductInstancePage(page: number) {

        this.productService.getInstancesByProduct(this.product().productId, page).pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: data => {

                this.handleInstancesPagination(data, page);

            }, error: error => {

                this.handleInstancesError(error);
            }
        })

    }


    handleInstancesPagination(data: ProductInstancesPage, page: number) {

        this.instances.set(this.sortInstances(data.content));
        this.currentInstancePage.set(page);

        if (this.currentInstancePage() + 1 >= data.page.totalPages) {
            this.nextInstancePageExists.set(false);
        } else {
            this.nextInstancePageExists.set(true);
        }

        if (this.currentInstancePage() === 0) {
            this.previousInstancePageExists.set(false);
        } else {
            this.previousInstancePageExists.set(true);
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

    sortInstances(instances: ProductInstance[]) : ProductInstance[] {

        if (this.product().groupByColour) {

            return instances.sort((a, b) => a.colour!.toLowerCase().localeCompare(b.colour!.toLowerCase()));

        }

        if (this.product().groupByWidth) {

            return instances.sort(((a, b) => a.width! - b.width!));
        }

        if (this.product().groupByLength) {

            return instances.sort(((a, b) => a.length! - b.length!));
        }

        return instances;

    }

    protected readonly ViewMode = ViewMode;
}
