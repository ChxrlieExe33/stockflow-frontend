import { Routes } from '@angular/router';
import {MainLayout} from './core/layouts/main-layout/main-layout';
import {AuthLayout} from './core/layouts/auth-layout/auth-layout';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
    },
    {
        path: 'auth',
        component: AuthLayout,
        loadChildren: () => import("./features/auth/auth.routes").then(r => r.authRoutes)
    }
];
