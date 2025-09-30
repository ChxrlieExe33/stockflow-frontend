import {Component, OnInit, signal} from '@angular/core';
import {ProductSearchResult, ProductService} from '../../../products/services/product-service';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {debounceTime, EMPTY, exhaustMap, Subject, switchMap, takeUntil} from 'rxjs';
import {catchError, filter, tap} from 'rxjs/operators';
import {Product} from '../../../../core/models/products/product.model';
import {CapitalizeFirstPipe} from '../../../../shared/pipes/capitalize-first.pipe';
import {ProductInstance} from '../../../../core/models/products/product-instance.model';
import {InstanceData} from '../../../../core/models/sales/sale-product-instance-data.model';
import {SaleProductInstancesTable} from '../../components/sale-product-instances-table/sale-product-instances-table';
import {SalesService} from '../../services/sales-service';
import {NewSaleModel} from '../../../../core/models/sales/new-sale.model';
import {Router} from '@angular/router';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-new-sale',
    imports: [
        ReactiveFormsModule,
        CapitalizeFirstPipe,
        SaleProductInstancesTable,
        NgClass
    ],
    providers: [AutoDestroyService],
  templateUrl: './new-sale.html',
  styleUrl: './new-sale.css'
})
export class NewSale implements OnInit {

    // The products found from the search bar.
    protected productResults = signal<ProductSearchResult[]>([]);

    protected loading = signal<boolean>(false);
    protected error = signal<string | undefined>(undefined);

    // The current selected root product.
    protected selectedProduct = signal<Product | undefined>(undefined);

    // The product instances found derived from the current selected product and the applied filters.
    protected productInstanceResults = signal<ProductInstance[]>([]);

    // The list of product instance IDs selected for the sale.
    protected chosenInstanceIds = signal<string[]>([]);

    // A projection of the selected instances for the sale for a table view.
    protected chosenInstancesData = signal<InstanceData[]>([]);

    protected submitSale$ = new Subject<void>();

    searchForm = new FormGroup({
        name: new FormControl('')
    })

    productOptionsForm = new FormGroup({
        width: new FormControl(null),
        length: new FormControl(null),
        height: new FormControl(null),
        colour: new FormControl(null),
    })

    saleInformationForm = new FormGroup({
        reference: new FormControl('', [Validators.required]),
        deliveryDate: new FormControl(null, [Validators.required]),
        address: new FormControl('', [Validators.required]),
        phoneNumber: new FormControl('', [Validators.required]),
        extraInformation: new FormControl(''),
    })

    constructor(private readonly productService: ProductService,
                private readonly destroy$: AutoDestroyService,
                private readonly  saleService: SalesService,
                private readonly router: Router) {}

    ngOnInit() {
        this.subscribeToSearch()
        this.subscribeToSubmitSale()
    }

    get referenceInvalid() {
        return this.saleInformationForm.controls.reference.invalid &&
            this.saleInformationForm.controls.reference.touched &&
            this.saleInformationForm.controls.reference.dirty;
    }

    get deliveryDateInvalid() {
        return this.saleInformationForm.controls.deliveryDate.invalid &&
            this.saleInformationForm.controls.deliveryDate.touched &&
            this.saleInformationForm.controls.deliveryDate.dirty;
    }

    get addressInvalid() {
        return this.saleInformationForm.controls.address.invalid &&
            this.saleInformationForm.controls.address.touched &&
            this.saleInformationForm.controls.address.dirty;
    }

    get phoneNumInvalid() {
        return this.saleInformationForm.controls.phoneNumber.invalid &&
            this.saleInformationForm.controls.phoneNumber.touched &&
            this.saleInformationForm.controls.phoneNumber.dirty;
    }

    get saleInvalid() {

        return this.saleInformationForm.invalid || this.chosenInstanceIds().length < 1;

    }

    /**
     * Subscribe to value changes in the product search bar, and get results based on the provided name.
     */
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

    subscribeToSubmitSale() {

        this.submitSale$.pipe(
            takeUntil(this.destroy$),
            filter(() => !this.saleInvalid),
            exhaustMap(() => {

                const sale = <NewSaleModel>{
                    reference: this.saleInformationForm.controls.reference.value!,
                    deliveryDate: this.saleInformationForm.controls.deliveryDate.value!,
                    deliveryAddress: this.saleInformationForm.controls.address.value!,
                    deliveryPhoneNumber: this.saleInformationForm.controls.phoneNumber.value!,
                    extraInformation: this.saleInformationForm.controls.extraInformation.value!,
                    productInstanceIds: this.chosenInstanceIds(),
                }

                return this.saleService.submitNewSale(sale).pipe(
                    catchError((err) => {
                        this.handleError(err);
                        return EMPTY;
                    })
                )

            })
        ).subscribe({
            next: () => {

                this.router.navigateByUrl('/sales').then(() => {});

            }
        })

    }

    /**
     * Select a product from the search results, set the selected product data and set it as the current.
     * Then reset form.
     * @param productId The product ID.
     */
    selectProduct(productId: string) {

        this.getProductData(productId);

        this.searchForm.controls.name.patchValue('');
        this.searchForm.controls.name.disable();

        this.productResults.set([]);

    }

    /**
     * Remove the current selection to choose another product.
     */
    unselectCurrentProduct() {

        this.selectedProduct.set(undefined);
        this.searchForm.controls.name.enable();
        this.productOptionsForm.reset();
        this.productInstanceResults.set([]);
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


    getInstancesOfCurrentSelection() {

        let filters = new Map<string, string | null>();

        filters.set("width", this.productOptionsForm.controls.width.value);
        filters.set("length", this.productOptionsForm.controls.length.value);
        filters.set("height", this.productOptionsForm.controls.height.value);
        filters.set("colour", this.productOptionsForm.controls.colour.value);

        this.productService.findInstancesOfProductWithFilters(this.selectedProduct()!.productId, filters).pipe(
            takeUntil(this.destroy$),
        ).subscribe({
            next: (res) => {

                // Remove any instances that are already "taken" during this sale from the search result (in case the same query is done twice and the same instance appears again).
                const alreadyTakenRemoved = res.filter(inst => !this.chosenInstanceIds().includes(inst.instanceId))

                this.productInstanceResults.set(alreadyTakenRemoved);
            }, error: (err) => {
                this.handleError(err);
                this.productInstanceResults.set([])
            }
        })

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

        this.chosenInstancesData.set([data, ...this.chosenInstancesData()]);
        this.chosenInstanceIds.set([instance.instanceId, ...this.chosenInstanceIds()])

        // Remove the chosen instance from the search results.
        const afterRemoval = this.productInstanceResults().filter(instance => !this.chosenInstanceIds().includes(instance.instanceId))
        this.productInstanceResults.set(afterRemoval)

    }

    handleError(err: any) {

        if (err.error && typeof err.error === 'object' && err.error.message) {
            console.log(err.error.message);
            this.error.set(err.error.message);
        } else {
            console.log(err);
            this.error.set("Something went wrong when retrieving data for the sale, please try again later.");
        }

    }

}
