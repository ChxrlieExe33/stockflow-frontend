import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Auth} from '../../models/auth/auth.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';

type LoginResponse = {
    message : string,
    username : string,
    expiration : Date,
    jwt: string,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private auth = new BehaviorSubject<Auth | undefined>(undefined);
    public auth$ = this.auth.asObservable();

    constructor(private httpClient: HttpClient, private router: Router) {

        const stored = this.retrieveAuthFromStorage();
        this.auth.next(stored);
    }

    public login(username: string, password: string){

        const loginData = {
            username : username,
            password: password,
        }

        return this.httpClient.post<LoginResponse>(`${environment.apiBaseUrl}/api/v1/auth/login`, loginData).pipe(
            tap({
               next: res => {

                   const auth = <Auth>{
                       username: res.username,
                       jwt: res.jwt,
                       jwtExpiry: res.expiration,
                   }

                   this.auth.next(auth);

                   this.saveAuthInStorage(auth);

                   this.router.navigate(['/']).then();
               }
            })
        );
    }

    saveAuthInStorage(auth : Auth) {

        localStorage.setItem("auth", JSON.stringify(auth));

    }

    retrieveAuthFromStorage() : Auth | undefined {

        const storedAuth = localStorage.getItem("auth");

        if (storedAuth) {

            const auth : Auth = JSON.parse(storedAuth);

            const now = new Date();
            const expiry = new Date(auth.jwtExpiry);

            // Check if expired
            if(expiry < now) {
                this.logout();
            }

            return auth;

        } else {

            setTimeout(() => {
                if (this.router.url !== '/auth/login') {
                    this.router.navigate(['/auth', 'login']).then();
                }
            }, 100);

            return undefined;
        }

    }

    logout() {

        localStorage.removeItem('auth');

        this.auth.next(undefined);

        setTimeout(() => {
            if (this.router.url !== '/auth/login') {
                this.router.navigate(['/auth', 'login']).then();
            }
        }, 100);
    }

    getCurrentUsername() : string | undefined {

         return this.auth.value?.username;

    }

    isAuthed() : boolean {

        return !!this.auth.value;

    }

}
