import {Component, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProductSearchResult, ProductService} from '../../../products/services/product-service';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {debounceTime, EMPTY, switchMap, takeUntil} from 'rxjs';
import {catchError, filter, tap} from 'rxjs/operators';
import {CapitalizeFirstPipe} from '../../../../shared/pipes/capitalize-first.pipe';
import {Product} from '../../../../core/models/products/product.model';
import {NewProductInstanceModelWithName} from '../../../../core/models/products/new-prod-instance-with-name.model';

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

    productOptionsForm = new FormGroup({
        width: new FormControl(null),
        length: new FormControl(null),
        height: new FormControl(null),
        colour: new FormControl(null),
        count: new FormControl(null, [Validators.required]),
    })

    protected productResults = signal<ProductSearchResult[]>([]);
    protected loading = signal<boolean>(false);
    protected error = signal<string | undefined>(undefined);

    protected selectedProduct = signal<Product | undefined>(undefined);

    protected newInstances = signal<NewProductInstanceModelWithName[]>([]);

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
            filter(() => !this.selectedProduct() && this.searchForm.controls.productName.value !== ''),
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

    selectProduct(productId: string) {

        this.getProductData(productId);

        this.searchForm.controls.productName.patchValue('');
        this.searchForm.controls.productName.disable();

        this.productResults.set([]);

    }

    unselectCurrentProduct() {

        this.selectedProduct.set(undefined);
        this.searchForm.controls.productName.enable();
    }

    getProductData(productId: string) {

        this.productService.getProductDetail(productId).pipe(
            takeUntil(this.destroy$),
        ).subscribe({
            next: (res) => {
                this.selectedProduct.set(res);
            }, error: (err) => {
                this.handleError(err);
            }
        })

    }

    addCurrentSelectionForSaving() {

        let toAdd : NewProductInstanceModelWithName[] = [];
        const count = +this.productOptionsForm.controls.count.value!;

        for (let i=1; i<=count; i++) {

            let current : NewProductInstanceModelWithName = {
                rootProductId: this.selectedProduct()!.productId,
                rootProductName: this.selectedProduct()!.name,
                width: null,
                length: null,
                height: null,
                colour: null,
                reserved: false
            };

            // TODO: Validate each of these to make sure they are set if the root product is grouped by those properties.
            if (this.selectedProduct()?.groupByWidth){
                current.width = this.productOptionsForm.controls.width.value;
            }

            if(this.selectedProduct()?.groupByLength){
                current.length = this.productOptionsForm.controls.length.value;
            }

            if (this.selectedProduct()?.groupByHeight){
                current.height = this.productOptionsForm.controls.height.value;
            }

            if (this.selectedProduct()?.groupByColour){
                current.colour = this.productOptionsForm.controls.colour.value;
            }

            toAdd.push(current);

        }

        this.newInstances.set([...this.newInstances(), ...toAdd]);
        this.productOptionsForm.reset();

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
