import {Component, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ProductSearchResult, ProductService} from '../../../products/services/product-service';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {debounceTime, EMPTY, switchMap, takeUntil} from 'rxjs';
import {catchError, filter, tap} from 'rxjs/operators';
import {CapitalizeFirstPipe} from '../../../../shared/pipes/capitalize-first.pipe';

@Component({
  selector: 'app-receive-delivery',
    imports: [
        ReactiveFormsModule,
        CapitalizeFirstPipe
    ],
    providers: [AutoDestroyService],
  templateUrl: './receive-delivery.html',
  styleUrl: './receive-delivery.css'
})
export class ReceiveDelivery implements OnInit {

    searchForm = new FormGroup({
        productName : new FormControl('')
    })

    protected productResults = signal<ProductSearchResult[]>([]);
    protected loading = signal<boolean>(false);
    protected error = signal<string | undefined>(undefined);

    protected selectedProduct = signal<{name: string, id: string} | undefined>(undefined);

    constructor(private productService: ProductService, private readonly destroy$: AutoDestroyService) {}

    ngOnInit() {

        this.subscribeToSearch()

    }

    subscribeToSearch() {

        this.searchForm.controls.productName.valueChanges.pipe(
            takeUntil(this.destroy$),
            debounceTime(300),
            tap(() => {
                this.loading.set(true)
                this.productResults.set([])
            }),
            filter(() => !this.selectedProduct()),
            switchMap(() => {
                return this.productService.searchByName(this.searchForm.controls.productName.value!).pipe(
                    catchError((err) => {
                        this.handleError(err);
                        return EMPTY;
                    })
                )
            })
        ).subscribe({
            next: (res) => {

                this.error.set(undefined);
                this.productResults.set(res)
                this.loading.set(false)

            }
        });

    }

    selectProduct(productId: string, productName: string) {

        const prod = {
            id : productId,
            name : productName
        }

        this.selectedProduct.set(prod);

        this.searchForm.controls.productName.patchValue('');

        this.productResults.set([]);

    }

    unselectCurrentProduct() {

        this.selectedProduct.set(undefined);
    }

    handleError(err: any) {

        if (err.error && typeof err.error === 'object' && err.error.message) {
            console.log(err.error.message);
            this.error.set(err.error.message);
        } else {
            console.log(err);
            this.error.set("Something went wrong when fetching categories, please try again later.");
        }

    }

}
