import {ResolveFn, Router} from '@angular/router';
import {catchError, Observable, of} from 'rxjs';
import {inject} from '@angular/core';
import {CategoryService} from '../../features/categories/services/category-service';

export const categoryDetailResolver : ResolveFn<Category | undefined> = (activatedRoute, routerState) : Observable<Category | undefined> => {

    const postService = inject(CategoryService);
    const router = inject(Router)

    return postService.getCategoryDetail(activatedRoute.params['categoryId']).pipe(
        catchError(err => {
            router.navigate(['/categories', 'not-found']).then();

            return of(undefined);
        })
    )

}
