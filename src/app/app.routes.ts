import {Routes} from '@angular/router';
import {MainLayout} from './core/layouts/main-layout/main-layout';
import {AuthLayout} from './core/layouts/auth-layout/auth-layout';
import {isAuthedGuardCanActivate} from './core/guards/is-authed.guard';
import {NotFound} from './shared/pages/not-found/not-found';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        canActivate: [isAuthedGuardCanActivate],
        children: [
            {
                path: 'categories',
                loadChildren: () => import("./features/categories/categories.routes").then(r => r.categoriesRoutes)
            },
            {
                path: 'products',
                loadChildren: () => import("./features/products/products.routes").then(r => r.productRoutes)
            },
            {
                path: 'deliveries',
                loadChildren: () => import("./features/deliveries/deliveries.routes").then(r => r.deliveryRoutes)
            },
            {
                path: 'sales',
                loadChildren: () => import("./features/sales/sales.routes").then(r => r.salesRoutes)
            },
            {
                path: 'not-found',
                component: NotFound
            }
        ]
    },
    {
        path: 'auth',
        component: AuthLayout,
        loadChildren: () => import("./features/auth/auth.routes").then(r => r.authRoutes)
    }
];
