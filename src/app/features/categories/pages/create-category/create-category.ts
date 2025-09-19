import {Component, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CategoryService} from '../../services/category-service';
import {exhaustMap, of, Subject} from 'rxjs';
import {catchError, filter, map} from 'rxjs/operators';
import {Router} from '@angular/router';

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

    protected form = new FormGroup({
        categoryName: new FormControl('', [Validators.required]),
    })

    protected error = signal<string | undefined>(undefined);

    constructor(
        private readonly categoryService: CategoryService,
        private readonly router: Router
    ) {}

    ngOnInit() {

        this.subscribeToSubmitted()

    }

    subscribeToSubmitted() {

        this.submitted.pipe(
            filter(() => this.form.valid),
            exhaustMap(() => {
                return this.categoryService.submitNewCategory(this.form.controls.categoryName.value!).pipe(
                    map((data) => ({success: true as const, data: data})),
                    catchError((error) => of({success: false as const, error: error}))
                )
            })
        ).subscribe({
            next: (res) => {

                if (res.success) {

                    this.router.navigate(["/categories"]).then();

                } else {

                    this.handleError(res.error)

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
