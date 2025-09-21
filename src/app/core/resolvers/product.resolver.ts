import {ResolveFn, Router} from '@angular/router';
import {catchError, Observable, of} from 'rxjs';
import {inject} from '@angular/core';
import {ProductService} from '../../features/products/services/product-service';
import {Product} from '../models/products/product.model';

export const productDetailResolver: ResolveFn<Product | undefined> = (activatedRoute, routerState): Observable<Product | undefined> => {

    const productService = inject(ProductService);
    const router = inject(Router)

    return productService.getProductDetail(activatedRoute.params['productId']).pipe(
        catchError(err => {

            let error: string;

            if (err.error && typeof err.error === 'object' && err.error.message) {
                console.log(err.error.message);
                error = err.error.message;
            } else {
                console.log(err);
                error = "Something went wrong when fetching the product, please try again later.";
            }

            router.navigate(['/not-found'], {queryParams: {message: error}}).then();

            return of(undefined);
        })
    )

}
