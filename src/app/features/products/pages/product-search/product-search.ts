import {Component, OnInit, signal} from '@angular/core';
import {ProductSearchResult, ProductService} from '../../services/product-service';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {debounceTime, distinctUntilChanged, EMPTY, switchMap, takeUntil} from 'rxjs';
import {catchError, filter, tap} from 'rxjs/operators';
import {CapitalizeFirstPipe} from '../../../../shared/pipes/capitalize-first.pipe';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-product-search',
    imports: [
        ReactiveFormsModule,
        CapitalizeFirstPipe,
        RouterLink
    ],
    providers: [AutoDestroyService],
  templateUrl: './product-search.html',
  styleUrl: './product-search.css'
})
export class ProductSearch implements OnInit {

    searchResults = signal<ProductSearchResult[]>([]);

    error = signal<string | undefined>(undefined);
    loading = signal<boolean>(false);

    form = new FormGroup({
        name: new FormControl(''),
    })

    constructor(
        private readonly productService: ProductService,
        private readonly destroy$ : AutoDestroyService
    ) { }


    ngOnInit() {

        this.subscribeToSearch()

    }

    subscribeToSearch() {

        this.form.controls.name.valueChanges.pipe(
            takeUntil(this.destroy$),
            debounceTime(300),
            tap(() => {
                this.loading.set(true)
                this.searchResults.set([])
            }),
            distinctUntilChanged(),
            filter(value => !!value && value.trim().length > 0), // Ignores empty strings
            switchMap(val => {
                return this.productService.searchByName(val!).pipe(
                    catchError(err => {
                        this.handleError(err);
                        this.loading.set(false);
                        return EMPTY;
                    })
                )
            })
        ).subscribe({
            next: (res) => {

                this.error.set(undefined);
                this.searchResults.set(res);
                this.loading.set(false);

            }
        });

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

    get noSearchResults() : boolean {

        if (this.form.controls.name.value) {

            return this.form.controls.name.value.length > 0 && this.searchResults().length < 1;

        } else {

            return false;

        }

    }

}
