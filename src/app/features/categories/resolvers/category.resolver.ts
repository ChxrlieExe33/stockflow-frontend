import {ResolveFn, Router} from '@angular/router';
import {catchError, Observable, of} from 'rxjs';
import {inject} from '@angular/core';
import {CategoryService} from '../services/category-service';

export const categoryDetailResolver: ResolveFn<Category | undefined> = (activatedRoute, routerState): Observable<Category | undefined> => {

    const postService = inject(CategoryService);
    const router = inject(Router)

    return postService.getCategoryDetail(activatedRoute.params['categoryId']).pipe(
        catchError(err => {

            let error: string;

            if (err.error && typeof err.error === 'object' && err.error.message) {
                console.log(err.error.message);
                error = err.error.message;
            } else {
                console.log(err);
                error = "Something went wrong when fetching categories, please try again later.";
            }

            router.navigate(['/not-found'], {queryParams: {message: error}}).then();

            return of(undefined);
        })
    )

}
