import {Component, input, OnInit, signal} from '@angular/core';
import {SaleInfoModel} from '../../../../core/models/sales/sale-info.model';
import {CapitalizeFirstPipe} from '../../../../shared/pipes/capitalize-first.pipe';
import {DatePipe} from '@angular/common';
import {InstanceData} from '../../../../core/models/sales/sale-product-instance-data.model';
import {EMPTY, exhaustMap, Subject, takeUntil} from 'rxjs';
import {SalesService} from '../../services/sales-service';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {catchError, filter, tap} from 'rxjs/operators';
import {UpdateSaleInfoModel} from '../../../../core/models/sales/update-sale-info.model';

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

    // From the resolver and wired with component input binding.
    sale = input.required<SaleInfoModel>();
    updatedSale = signal<SaleInfoModel | undefined>(undefined);

    saleProducts = signal<InstanceData[]>([]);
    productsToRemove = signal<InstanceData[]>([]);
    productsToAdd = signal<InstanceData[]>([]);

    protected saleInfoSubmitted$ = new Subject<void>();

    error = signal<string | undefined>(undefined);

    saleInfoUpdated = signal<boolean>(false);

    saleInfoForm! : FormGroup;

    constructor(
        private readonly saleService : SalesService,
        private readonly destroy$: AutoDestroyService,
        private readonly fb: FormBuilder,
    ) {}

    ngOnInit() {

        this.updatedSale.set(this.sale());
        this.subscribeToSaleProducts();
        this.setupSaleForm();
        this.subscribeToSubmitSaleInformationUpdate()
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

                this.handleError(error);

            }
        })

    }

    subscribeToSubmitSaleInformationUpdate() {

        this.saleInfoSubmitted$.pipe(
            takeUntil(this.destroy$),
            tap(() => this.saleInfoUpdated.set(false)),
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
                        this.handleError(err);
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

    handleError(err: any) {

        if (err.error && typeof err.error === 'object' && err.error.message) {
            console.log(err.error.message);
            this.error.set(err.error.message);
        } else {
            console.log(err);
            this.error.set("Something went wrong when editing sale, please try again later.");
        }

    }

}
