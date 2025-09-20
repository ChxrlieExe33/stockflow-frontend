import {Component, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoryService} from '../../../categories/services/category-service';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {debounceTime, distinctUntilChanged, EMPTY, exhaustMap, Subject, switchMap, takeUntil} from 'rxjs';
import {Location} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {catchError, filter} from 'rxjs/operators';
import {ProductService} from '../../services/product-service';
import {CreateProductModel} from '../../../../core/models/products/create-product.model';

@Component({
  selector: 'app-create-product',
    imports: [
        ReactiveFormsModule
    ],
    providers: [AutoDestroyService],
  templateUrl: './create-product.html',
  styleUrl: './create-product.css'
})
export class CreateProduct implements OnInit {

    protected category = signal<Category | undefined>(undefined);
    protected categoryProvidedInParameter = signal<boolean>(false);

    protected categorySearchResults = signal<Category[] | undefined>(undefined);

    protected error = signal<string | undefined>(undefined);

    protected submitted$ = new Subject<void>();

    protected productForm = new FormGroup({
        productName: new FormControl('', [Validators.required]),
        factoryName: new FormControl('', [Validators.required]),
        isGroupByWidth: new FormControl(false),
        isGroupByLength: new FormControl(false),
        isGroupByHeight: new FormControl(false),
        isGroupByColour: new FormControl(false),
    })

    protected categorySearchForm = new FormGroup({
        categoryName: new FormControl(''),
    })

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly categoryService: CategoryService,
        private readonly productService: ProductService,
        private readonly destroy$: AutoDestroyService,
        private readonly location: Location,
        private readonly router: Router,
    ) {}


    ngOnInit() {

        this.checkForCategoryIdInParams()
        this.subscribeToCategorySearch()
        this.subscribeToSubmit()

    }

    subscribeToSubmit() {

        this.submitted$.pipe(
            takeUntil(this.destroy$),
            exhaustMap(() => {
                return this.productService.createNewProduct(<CreateProductModel>{
                    name: this.productForm.controls.productName.value,
                    factoryName: this.productForm.controls.factoryName.value!,
                    groupByWidth: this.productForm.controls.isGroupByWidth.value!,
                    groupByLength: this.productForm.controls.isGroupByLength.value!,
                    groupByHeight: this.productForm.controls.isGroupByHeight.value!,
                    groupByColour: this.productForm.controls.isGroupByColour.value!,
                    categoryId: this.category()!.categoryId
                }).pipe(
                    catchError(err => {

                        this.handleError(err);
                        return EMPTY;

                    })
                )
            })
        ).subscribe({
            next: () => {

                this.router.navigate(['/categories', 'detail', this.category()!.categoryId]).then();

            }
        });

    }

    clearCurrentCategory() {

        this.category.set(undefined);

        // Remove the category ID query param.
        const path = this.location.path().split('?')[0];
        this.location.replaceState(path);
    }

    setCurrentCategory(category: Category) {

        this.category.set(category);
        this.categorySearchForm.reset();
        this.categorySearchResults.set(undefined);
    }

    checkForCategoryIdInParams() {

        if (this.activatedRoute.snapshot.queryParams["categoryId"]) {

            const categoryId = String(this.activatedRoute.snapshot.queryParams["categoryId"]);

            this.categoryProvidedInParameter.set(true);
            this.getCategory(categoryId);

        }

    }

    getCategory(id: string) {

        this.categoryService.getCategoryDetail(id).pipe(
            takeUntil(this.destroy$),
        ).subscribe({
            next: data => {

                this.category.set(data);

            }, error: error => {

                this.handleError(error);
                this.categoryProvidedInParameter.set(false);

            }
        })

    }

    handleError(err: any) {

        if (err.error && typeof err.error === 'object' && err.error.message) {
            console.log(err.error.message);
            this.error.set(err.error.message);
        } else {
            console.log(err);
            this.error.set("Something went wrong when fetching the category, please try again later.");
        }

    }

    subscribeToCategorySearch() {

        this.categorySearchForm.controls.categoryName.valueChanges.pipe(
            takeUntil(this.destroy$),
            debounceTime(500),
            distinctUntilChanged(),
            filter(value => !!value && value.trim().length > 0), // Ignores empty strings
            switchMap(value => {
                return this.categoryService.searchCategoriesByName(value!).pipe(
                    catchError(err => {

                        this.handleError(err)
                        return EMPTY;
                    }),
                );
            })
        ).subscribe({
            next: data => {

                if (data.length > 0) {
                    this.categorySearchResults.set(data);
                } else {
                    this.categorySearchResults.set(undefined);
                }

            }
        });

    }
}
