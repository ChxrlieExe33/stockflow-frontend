import {Component, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProductSearchResult, ProductService} from '../../../products/services/product-service';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {debounceTime, EMPTY, exhaustMap, Observable, Subject, switchMap, takeUntil} from 'rxjs';
import {catchError, filter, tap} from 'rxjs/operators';
import {CapitalizeFirstPipe} from '../../../../shared/pipes/capitalize-first.pipe';
import {Product} from '../../../../core/models/products/product.model';
import {NewProductInstanceModelWithName} from '../../../../core/models/products/new-prod-instance-with-name.model';
import {NewProductInstanceModel} from '../../../../core/models/products/new-prod-instance.model';
import {Router} from '@angular/router';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-receive-delivery',
    imports: [
        ReactiveFormsModule,
        CapitalizeFirstPipe,
        NgClass
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
        count: new FormControl(1, [Validators.required]),
    })

    protected productResults = signal<ProductSearchResult[]>([]);
    protected loading = signal<boolean>(false);
    protected error = signal<string | undefined>(undefined);

    protected selectedProduct = signal<Product | undefined>(undefined);

    protected newInstances = signal<NewProductInstanceModelWithName[]>([]);

    protected submitted$ = new Subject<void>();

    constructor(private readonly productService: ProductService,
                private readonly destroy$: AutoDestroyService,
                private readonly router: Router
    ) {}

    ngOnInit() {

        this.subscribeToSearch()
        this.subscribeToSubmit()

    }

    /**
     * Subscribe to value changes in the product search bar, and get results based on the provided name.
     */
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

    /**
     * Handle the submission of the product instances.
     */
    subscribeToSubmit() {

        this.submitted$.pipe(
            takeUntil(this.destroy$),
            exhaustMap(() => {
                return this.handleSubmit().pipe(
                    catchError((err) => {
                        this.handleError(err);
                        return EMPTY;
                    })
                )
            })
        ).subscribe({
            next: (res) => {

                this.router.navigate(["/categories"]).then(() => {});

            }
        })

    }

    handleSubmit() : Observable<void> {

        const instances = this.newInstances().map(instance => <NewProductInstanceModel>{
            rootProductId: instance.rootProductId,
            width: instance.width,
            length: instance.length,
            height: instance.height,
            colour: instance.colour,
            reserved: instance.reserved,
        });

        return this.productService.receiveNewProductInstances(instances)

    }

    /**
     * Select a product from the search results, set the selected product data and set it as the current.
     * Then reset form.
     * @param productId The product ID.
     */
    selectProduct(productId: string) {

        this.getProductData(productId);

        this.searchForm.controls.productName.patchValue('');
        this.searchForm.controls.productName.disable();

        this.productResults.set([]);

    }

    /**
     * Remove the current selection to choose another product.
     */
    unselectCurrentProduct() {

        this.selectedProduct.set(undefined);
        this.searchForm.controls.productName.enable();
    }

    /**
     * Once a product is selected from the search results, get all of its data instead of the small search result summary.
     * @param productId The product ID to get details of.
     */
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

    /**
     * Once a product, its options and the count of these is set,
     * add these to the list of all instances to save.
     */
    addCurrentSelectionForSaving() {

        let toAdd : NewProductInstanceModelWithName[] = [];
        const count = +this.productOptionsForm.controls.count.value!;

        if (isNaN(count) || count < 1 || count === null){

            alert("The count must be at least 1");
            return;

        }

        // Since the backend expects an array of objects, for the count, create as many objects as the count is.
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

            let badFieldNames : string[] = [];

            if (this.selectedProduct()?.groupByWidth){

                if (this.productOptionsForm.controls.width.value !== null) {
                    current.width = this.productOptionsForm.controls.width.value;
                } else {
                    badFieldNames.push("width");
                }

            }

            if(this.selectedProduct()?.groupByLength){

                if (this.productOptionsForm.controls.length.value !== null) {
                    current.length = this.productOptionsForm.controls.length.value;
                } else {
                    badFieldNames.push("length");
                }
            }

            if (this.selectedProduct()?.groupByHeight){
                if (this.productOptionsForm.controls.height.value !== null) {
                    current.height = this.productOptionsForm.controls.height.value;
                } else {
                    badFieldNames.push("height");
                }
            }

            if (this.selectedProduct()?.groupByColour){
                if (this.productOptionsForm.controls.colour.value !== null) {
                    current.colour = this.productOptionsForm.controls.colour.value;
                } else {
                    badFieldNames.push("colour");
                }
            }

            if (badFieldNames.length > 0) {
                const alertMsg = "The following fields must be set: " +  badFieldNames.join(', ');
                alert(alertMsg);
                return;
            }

            toAdd.push(current);

        }

        this.newInstances.set([...this.newInstances(), ...toAdd]);
        this.productOptionsForm.reset();

    }

    removeInstanceFromSaving(index: number) {

        const afterRemoval = this.newInstances().filter((_, i) => i !== index);

        this.newInstances.set(afterRemoval);

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
