import {Component, input, OnInit, signal} from '@angular/core';
import {SaleInfoModel} from '../../../../core/models/sales/sale-info.model';
import {CapitalizeFirstPipe} from '../../../../shared/pipes/capitalize-first.pipe';
import {DatePipe} from '@angular/common';
import {InstanceData} from '../../../../core/models/sales/sale-product-instance-data.model';
import {debounceTime, EMPTY, exhaustMap, Subject, switchMap, takeUntil} from 'rxjs';
import {SalesService} from '../../services/sales-service';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {catchError, filter, tap} from 'rxjs/operators';
import {UpdateSaleInfoModel} from '../../../../core/models/sales/update-sale-info.model';
import {ProductSearchResult, ProductService} from '../../../products/services/product-service';
import { Product } from '../../../../core/models/products/product.model';
import {ProductInstance} from '../../../../core/models/products/product-instance.model';
import {UpdateSaleProductsModel} from '../../../../core/models/sales/update-sale-products.model';
import {Router} from '@angular/router';
import {getErrorMessage} from '../../../../shared/utils/get-error-message';

@Component({
  selector: 'app-update-sale',
    imports: [
        CapitalizeFirstPipe,
        DatePipe,
        ReactiveFormsModule
    ],
    providers: [AutoDestroyService],
  templateUrl: './update-sale.html',
  styleUrl: './update-sale.css'
})
export class UpdateSale implements OnInit {

    // TODO: Split this page into at least 2 components, at least the header with its own logic for handling that form, and one for the table and form at the bottom.

    // Sale information state

    // From the resolver and wired with component input binding.
    sale = input.required<SaleInfoModel>();
    updatedSale = signal<SaleInfoModel | undefined>(undefined);

    protected saleInfoSubmitted$ = new Subject<void>();

    saleInfoUpdateError = signal<string | undefined>(undefined);
    productRetrievalError = signal<string | undefined>(undefined);
    saleProductsUpdateError = signal<string | undefined>(undefined);
    productSearchError = signal<string | undefined>(undefined);

    saleInfoUpdated = signal<boolean>(false);

    saleInfoForm! : FormGroup;

    // Sale products state

    // The products found from the search bar.
    protected productResults = signal<ProductSearchResult[]>([]);

    saleProducts = signal<InstanceData[]>([]);
    productsToRemove = signal<InstanceData[]>([]);
    productsToAdd = signal<InstanceData[]>([]);
    protected loading = signal<boolean>(false);
    protected selectedProduct = signal<Product | undefined>(undefined);
    protected productInstanceResults = signal<ProductInstance[]>([]);

    protected productChangesSubmitted$ = new Subject<void>();

    searchForm = new FormGroup({
        name: new FormControl('')
    })

    productOptionsForm = new FormGroup({
        width: new FormControl(null),
        length: new FormControl(null),
        height: new FormControl(null),
        colour: new FormControl(null),
    })


    constructor(
        private readonly saleService : SalesService,
        private readonly destroy$: AutoDestroyService,
        private readonly fb: FormBuilder,
        private readonly productService: ProductService,
        private readonly router: Router,
    ) {}

    ngOnInit() {

        this.updatedSale.set(this.sale());
        this.subscribeToSaleProducts();
        this.setupSaleForm();
        this.subscribeToSubmitSaleInformationUpdate();
        this.subscribeToSearch();
        this.subscribeToSaleProductChangesSubmitted()
    }

    setupSaleForm() {

        this.saleInfoForm = this.fb.group({
            reference: [this.sale().reference, Validators.required],
            deliveryDate: [this.sale().deliveryDate, Validators.required],
            deliveryAddress: [this.sale().deliveryAddress, Validators.required],
            deliveryPhoneNumber: [this.sale().deliveryPhoneNumber, Validators.required],
            extraInformation: [this.sale().extraInformation],
            delivered: [this.sale().delivered],
        })

    }

    subscribeToSaleProducts() {

        this.saleService.getSaleProducts(this.sale().orderId).pipe(takeUntil(this.destroy$)).subscribe({
            next: data => {

                this.saleProducts.set(data);

            }, error: error => {

                this.productRetrievalError.set(getErrorMessage(error));

            }
        })

    }

    subscribeToSubmitSaleInformationUpdate() {

        this.saleInfoSubmitted$.pipe(
            takeUntil(this.destroy$),
            tap(() => {
                this.saleInfoUpdated.set(false);
                this.saleInfoUpdateError.set(undefined);
            }),
            filter(() => this.saleInfoForm.valid),
            exhaustMap(() => {

                const data = <UpdateSaleInfoModel>{
                    reference: this.saleInfoForm.controls['reference'].value,
                    deliveryDate: this.saleInfoForm.controls['deliveryDate'].value,
                    deliveryAddress: this.saleInfoForm.controls['deliveryAddress'].value,
                    deliveryPhoneNumber: this.saleInfoForm.controls['deliveryPhoneNumber'].value,
                    delivered: this.saleInfoForm.controls['delivered'].value
                };

                return this.saleService.updateSaleInformation(data, this.sale().orderId).pipe(
                    takeUntil(this.destroy$),
                    catchError((err) => {
                        this.saleInfoUpdateError.set(getErrorMessage(err));
                        return EMPTY;
                    })
                )

            })
        ).subscribe({
            next: data => {

                this.saleInfoUpdated.set(true);

            }
        })

    }

    // ------------------------------------------------------------------------------------------------------
    // ------------------------------ Methods to handle dynamic products table ------------------------------
    // ------------------------------------------------------------------------------------------------------

    clickedSubmitProductChanges() {

        if (this.productsToRemove().length < 1 && this.productsToAdd().length < 1) {
            alert("You have not changed the products in this order.")
            return;
        }

        if (confirm('Are you sure everything is correct?')) {
            this.productChangesSubmitted$.next();
        } else {
            return;
        }

    }

    subscribeToSaleProductChangesSubmitted() {

        this.productChangesSubmitted$.pipe(
            takeUntil(this.destroy$),
            tap(() => {
                this.saleProductsUpdateError.set(undefined);
            }),
            filter(() => this.productsToRemove().length > 0 || this.productsToAdd().length > 0),
            exhaustMap(() => {
                const data = <UpdateSaleProductsModel>{
                    toAddProductInstanceIds: this.productsToAdd().map(i => i.instanceId),
                    toRemoveProductInstanceIds: this.productsToRemove().map(i => i.instanceId)
                }

                return this.saleService.updateSaleProducts(this.sale().orderId, data).pipe(
                    takeUntil(this.destroy$),
                    catchError((err) => {
                        this.saleProductsUpdateError.set(getErrorMessage(err));
                        return EMPTY;
                    })
                )

            })
        ).subscribe({
            next: data => {

                this.router.navigate(['/sales', 'detail', this.sale().orderId]).then(() => {});

            }
        })

    }

    chooseProductForRemoval(index: number) {

        const product = this.saleProducts()[index];
        this.productsToRemove.set([...this.productsToRemove(), product]);

        const afterRemoval = this.saleProducts().filter((_, i) => i !== index);
        this.saleProducts.set(afterRemoval);

    }

    addProductBackToSale(index: number) {

        const product = this.productsToRemove()[index];
        this.saleProducts.set([...this.saleProducts(), product]);

        const afterRemoval = this.productsToRemove().filter((_, i) => i !== index);
        this.productsToRemove.set(afterRemoval);

    }

    subscribeToSearch() {

        this.searchForm.controls.name.valueChanges.pipe(
            takeUntil(this.destroy$),
            debounceTime(300),
            tap(() => {
                this.loading.set(true)
                this.productResults.set([])
            }),
            filter(() => !this.selectedProduct() && this.searchForm.controls.name.value !== ''),
            switchMap(() => {
                return this.productService.searchByName(this.searchForm.controls.name.value!).pipe(
                    catchError((err) => {
                        this.productSearchError.set(getErrorMessage(err));
                        return EMPTY;
                    })
                )
            })
        ).subscribe({
            next: (res) => {

                this.productSearchError.set(undefined);
                this.productResults.set(res)
                this.loading.set(false)

            }
        });

    }

    addInstanceToSale(instance : ProductInstance) {

        const data = <InstanceData>{
            productName: this.selectedProduct()!.name,
            instanceId: instance.instanceId,
            width: this.productOptionsForm.controls.width.value,
            length: this.productOptionsForm.controls.length.value,
            height: this.productOptionsForm.controls.height.value,
            colour: this.productOptionsForm.controls.colour.value,
        }

        this.productsToAdd.set([data, ...this.productsToAdd()]);

        // Remove the chosen instance from the search results.
        const addedInstanceIds = this.productsToAdd().map(instance => instance.instanceId);
        const afterRemoval = this.productInstanceResults().filter(instance => !addedInstanceIds.includes(instance.instanceId))
        this.productInstanceResults.set(afterRemoval)

    }

    getProductData(productId: string) {

        this.productService.getProductDetail(productId).pipe(
            takeUntil(this.destroy$),
            tap(() => {
                this.productSearchError.set(undefined);
            })
        ).subscribe({
            next: (res) => {
                this.selectedProduct.set(res);
            }, error: (err) => {
                this.productSearchError.set(getErrorMessage(err));
            }
        })

    }

    selectProduct(productId: string) {

        this.getProductData(productId);

        this.searchForm.controls.name.patchValue('');
        this.searchForm.controls.name.disable();

        this.productResults.set([]);

    }

    unselectCurrentProduct() {

        this.selectedProduct.set(undefined);
        this.searchForm.controls.name.enable();
        this.productOptionsForm.reset();
        this.productInstanceResults.set([]);
    }

    getInstancesOfCurrentSelection() {

        let filters = new Map<string, string | null>();

        filters.set("width", this.productOptionsForm.controls.width.value);
        filters.set("length", this.productOptionsForm.controls.length.value);
        filters.set("height", this.productOptionsForm.controls.height.value);
        filters.set("colour", this.productOptionsForm.controls.colour.value);

        this.productService.findInstancesOfProductWithFilters(this.selectedProduct()!.productId, filters).pipe(
            takeUntil(this.destroy$),
            tap(() => {
                this.productSearchError.set(undefined);
            })
        ).subscribe({
            next: (res) => {

                // Remove any instances that are already "taken" during this sale from the search result (in case the same query is done twice and the same instance appears again).
                const addedInstanceIds = this.productsToAdd().map(instance => instance.instanceId);
                const alreadyTakenRemoved = res.filter(inst => !addedInstanceIds.includes(inst.instanceId))

                this.productInstanceResults.set(alreadyTakenRemoved);
            }, error: (err) => {
                this.productSearchError.set(getErrorMessage(err));
                this.productInstanceResults.set([])
            }
        })

    }

    removeNewProduct(index: number) {

        const afterRemoval = this.productsToAdd().filter((_, i) => i !== index);
        this.productsToAdd.set(afterRemoval);

    }

}
