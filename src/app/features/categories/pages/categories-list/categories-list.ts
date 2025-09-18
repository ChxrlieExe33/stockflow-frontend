import {Component, OnInit, signal} from '@angular/core';
import {CategoriesPageResponse, CategoryService} from '../../services/category-service';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {takeUntil} from 'rxjs';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Location, NgClass} from '@angular/common';

@Component({
    selector: 'app-categories-list',
    imports: [
        RouterLink,
        NgClass
    ],
    providers: [AutoDestroyService],
    templateUrl: './categories-list.html',
    styleUrl: './categories-list.css'
})
export class CategoriesList implements OnInit {

    protected loadedCategories = signal<Category[]>([]);

    protected currentPage = signal<number>(0);
    protected nextPageExists = signal<boolean>(false);
    protected prevPageExists = signal<boolean>(false);
    protected totalPages = signal<number>(1);

    protected error = signal<string | undefined>(undefined);

    constructor(private readonly categoryService: CategoryService,
                private readonly destroy$: AutoDestroyService,
                private readonly activatedRoute: ActivatedRoute,
                private readonly location: Location) {}


    ngOnInit() {

        this.getFirstCategories()

    }

    getFirstCategories() {

        let page = this.currentPage();

        if (this.activatedRoute.snapshot.queryParams["page"]) {
            page = Number(this.activatedRoute.snapshot.queryParams["page"]);
        }

        this.categoryService.getAllCategories(page).pipe(takeUntil(this.destroy$)).subscribe({
            next: (data) => {

                this.handlePagination(data, page);

            }, error: err => {
                this.handleError(err);
            }
        })

    }

    getCategoriesPage(page: number) {

        this.categoryService.getAllCategories(page).pipe(takeUntil(this.destroy$)).subscribe({
            next: (data) => {

                this.handlePagination(data, page);

            }, error: err => {
                this.handleError(err);
            }
        })

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

    handlePagination(data: CategoriesPageResponse, page: number) {

        this.loadedCategories.set(data.content);
        this.currentPage.set(page);

        this.changePageQueryParam(page);

        if (this.currentPage() + 1 >= data.page.totalPages) {
            this.nextPageExists.set(false);
        } else {
            this.nextPageExists.set(true);
            this.totalPages.set(data.page.totalPages);
        }

        if (this.currentPage() === 0) {
            this.prevPageExists.set(false);
        } else {
            this.prevPageExists.set(true);
        }

    }

    changePageQueryParam(page: number) {

        const path = this.location.path().split('?')[0];
        const query = new URLSearchParams({ page: page.toString() }).toString();

        this.location.replaceState(path, query);
    }

}
