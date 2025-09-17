import {Component, input, OnInit, signal} from '@angular/core';
import {CategoryService, ProductPageResponse} from '../../services/category-service';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {takeUntil} from 'rxjs';
import {Product} from '../../../../core/models/products/product.model';
import {CapitalizeFirstPipe} from '../../../../shared/pipes/capitalize-first.pipe';

@Component({
    selector: 'app-category-detail',
    imports: [
        CapitalizeFirstPipe
    ],
    providers: [AutoDestroyService],
    templateUrl: './category-detail.html',
    styleUrl: './category-detail.css'
})
export class CategoryDetail implements OnInit {

    // Obtained with resolver and provided via component input binding.
    protected category = input.required<Category>();

    protected products = signal<Product[]>([]);

    protected nextPage = signal<number>(0);
    protected nextPageExists = signal<boolean>(true);

    protected error = signal<string | undefined>(undefined);

    constructor(private readonly categoryService: CategoryService, private readonly destroy$: AutoDestroyService) {
    }

    ngOnInit() {

        this.subscribeToFirstProducts()
    }

    subscribeToFirstProducts() {

        this.categoryService.getProductsBelongingToCategory(this.category().categoryId, this.nextPage()).pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: (res: ProductPageResponse) => {

                if (this.nextPage() + 1 >= res.page.totalPages) {
                    this.nextPageExists.set(false);
                } else {
                    const currentPage = this.nextPage();
                    this.nextPage.set(currentPage + 1);
                    this.nextPageExists.set(true);
                }

                this.products.set(res.content);
            }, error: err => {

                this.nextPageExists.set(false);

                if (err.error && typeof err.error === 'object' && err.error.message) {
                    console.log(err.error.message);
                    this.error.set(err.error.message);
                } else {
                    console.log(err);
                    this.error.set("Something went wrong when fetching categories, please try again later.");
                }

            }
        });

    }
}
