import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/common/auth-service';

export const isAuthedGuardCanActivate: CanActivateFn = (route, state) => {

    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isAuthed()
        ? true
        : router.createUrlTree(['/auth', 'login'], {
        queryParams: { returnUrl: state.url }
    });
};
