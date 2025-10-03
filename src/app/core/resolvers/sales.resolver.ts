import {ResolveFn, Router} from '@angular/router';
import {catchError, Observable, of} from 'rxjs';
import {inject} from '@angular/core';
import {SaleInfoModel} from '../models/sales/sale-info.model';
import {SalesService} from '../../features/sales/services/sales-service';

export const saleDetailResolver: ResolveFn<SaleInfoModel | undefined> = (activatedRoute, routerState): Observable<SaleInfoModel | undefined> => {

    const saleService = inject(SalesService);
    const router = inject(Router)

    return saleService.getSaleById(activatedRoute.params['saleId']).pipe(
        catchError(err => {

            let error: string;

            if (err.error && typeof err.error === 'object' && err.error.message) {
                console.log(err.error.message);
                error = err.error.message;
            } else {
                console.log(err);
                error = "Something went wrong when fetching the sale, please try again later.";
            }

            router.navigate(['/not-found'], {queryParams: {message: error}}).then();

            return of(undefined);
        })
    )

}
