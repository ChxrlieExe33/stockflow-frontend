import {Routes} from '@angular/router';
import {CreateProduct} from './pages/create-product/create-product';

export const productRoutes : Routes = [
    {
        path: "create",
        component: CreateProduct
    }
]
