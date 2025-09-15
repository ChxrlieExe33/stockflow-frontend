import {Component, OnInit, signal} from '@angular/core';
import {CategoryService} from '../../services/category-service';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {takeUntil} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-categories-list',
  imports: [],
    providers: [AutoDestroyService],
  templateUrl: './categories-list.html',
  styleUrl: './categories-list.css'
})
export class CategoriesList implements OnInit {

    protected loadedCategories = signal<Category[]>([]);
    protected nextPage = signal<number>(0);
    protected nextPageExists = signal<boolean>(false);

    protected error = signal<string | undefined>(undefined);

    constructor(private categoryService : CategoryService, private destroy$: AutoDestroyService, private activatedRoute: ActivatedRoute) {}


    ngOnInit() {

        this.getFirstCategories()

    }

    getFirstCategories() {

        let page = this.nextPage();

        if (this.activatedRoute.snapshot.queryParams["page"]) {
            page = this.activatedRoute.snapshot.queryParams["page"];
        }

        this.categoryService.getAllCategories(page).pipe(takeUntil(this.destroy$)).subscribe({
            next: (data) => {

                this.loadedCategories.set(data.content);

                if (this.nextPage() + 1 >= data.page.totalPages) {
                    this.nextPageExists.set(false);
                } else {
                    this.nextPageExists.set(true);

                    const currentPage = this.nextPage();
                    this.nextPage.set(currentPage + 1);
                }

            }, error: err => {

                if (err.error && typeof err.error === 'object' && err.error.message) {
                    console.log(err.error.message);
                    this.error.set(err.error.message);
                } else {
                    console.log(err);
                    this.error.set("Something went wrong when fetching categories, please try again later.");
                }

            }
        })

    }

}
