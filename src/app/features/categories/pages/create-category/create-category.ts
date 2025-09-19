import {Component, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CategoryService} from '../../services/category-service';
import {exhaustMap, of, Subject} from 'rxjs';
import {catchError, filter, map} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-create-category',
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './create-category.html',
  styleUrl: './create-category.css'
})
export class CreateCategory implements OnInit {

    protected submitted = new Subject<void>();

    protected updating = signal<boolean>(false);
    protected categoryToUpdate = signal<Category | undefined>(undefined);

    protected form = new FormGroup({
        categoryName: new FormControl('', [Validators.required]),
    })

    protected error = signal<string | undefined>(undefined);

    constructor(
        private readonly categoryService: CategoryService,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {

        this.subscribeToSubmitted()

        // Checking if we are on the update endpoint by looking for the categoryId route parameter.
        if(this.activatedRoute.snapshot.params['categoryId']) {

            this.updating.set(true);

            this.categoryService.getCategoryDetail(this.activatedRoute.snapshot.params['categoryId']).subscribe({
                next: data => {

                    this.categoryToUpdate.set(data);
                    this.form.controls.categoryName.setValue(data.name);

                }, error: err => {

                    this.handleError(err)

                }
            });

        }

    }

    subscribeToSubmitted() {

        this.submitted.pipe(
            filter(() => this.form.valid),
            exhaustMap(() => {

                if(this.updating()) {

                    return this.categoryService.updateCategory(this.categoryToUpdate()!.categoryId, this.form.controls.categoryName.value!).pipe(
                        map((data) => ({success: true as const, data: data})),
                        catchError((error) => of({success: false as const, error: error}))
                    )

                } else {

                    return this.categoryService.submitNewCategory(this.form.controls.categoryName.value!).pipe(
                        map((data) => ({success: true as const, data: data})),
                        catchError((error) => of({success: false as const, error: error}))
                    )

                }

            })
        ).subscribe({
            next: (res) => {

                if (this.updating()) {

                    if(res.success) {

                        this.router.navigate(['/categories', "detail", this.categoryToUpdate()!.categoryId]).then();

                    } else {

                        this.handleError(res.error);
                    }


                } else {

                    if (res.success) {

                        this.router.navigate(["/categories"]).then();

                    } else {

                        this.handleError(res.error)

                    }

                }

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

}
