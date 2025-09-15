import { Routes } from '@angular/router';
import {MainLayout} from './core/layouts/main-layout/main-layout';
import {AuthLayout} from './core/layouts/auth-layout/auth-layout';
import {isAuthedGuardCanActivate} from './core/guards/is-authed.guard';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        canActivate: [isAuthedGuardCanActivate],
        children: [
            {
                path: 'categories',
                loadChildren: () => import("./features/categories/categories.routes").then(r => r.categoriesRoutes)
            }
        ]
    },
    {
        path: 'auth',
        component: AuthLayout,
        loadChildren: () => import("./features/auth/auth.routes").then(r => r.authRoutes)
    }
];
