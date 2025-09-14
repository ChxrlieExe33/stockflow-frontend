import {Component, OnInit, signal} from '@angular/core';
import {Subject} from 'rxjs';
import {AuthService} from '../../../../core/services/common/auth-service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {catchError, map, filter, exhaustMap} from 'rxjs/operators';
import {of} from 'rxjs';

@Component({
  selector: 'app-login-page',
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage implements OnInit {

    submitted$ = new Subject<void>();
    error = signal<string | undefined>(undefined);

    form = new FormGroup({
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
    })

    constructor(private authService: AuthService) {}

    ngOnInit(): void {

        this.subscribeToSubmitLogin()

    }

    subscribeToSubmitLogin() {

        this.submitted$.pipe(
            filter(() => this.form.valid),
            exhaustMap(() => {
                return this.authService.login(this.form.controls.username.value!, this.form.controls.password.value!).pipe(
                    map((res) => ({success: true as const, data: res})),
                    catchError((err) => {
                        return of({success: false as const, error: err});
                    })
                )
            })
        ).subscribe(res => {

            if(!res.success) {

                const err = res.error;

                if (err.error && typeof err.error === 'object' && err.error.message) {
                    console.warn(err.error.message);
                    this.error.set(err.error.message);
                } else {
                    console.warn(err);
                    this.error.set("Something went wrong when logging in, please try again.");
                }

            }

        });

    }

}
