import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from '../services/common/auth-service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

    // Backend endpoints which should not have a JWT sent to them.
    const authEndpointPrefixes = [
        '/api/v1/auth/login'
    ];

    const url = new URL(req.url, window.location.origin);
    const path = url.pathname;

    const isAuthEndpoint = authEndpointPrefixes.some(prefix => path.startsWith(prefix));

    // Skip adding auth header for auth endpoints
    if (isAuthEndpoint) {
        return next(req);
    }

    const authService = inject(AuthService);

    const jwt = authService.getJwt();

    const authReq = req.clone({
        setHeaders: {
            'Authorization' : jwt!
        }
    });

    return next(authReq);


};
