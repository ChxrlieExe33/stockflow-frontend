import {Routes} from '@angular/router';
import {SalesList} from './pages/sales-list/sales-list';
import {NewSale} from './pages/new-sale/new-sale';

export const salesRoutes : Routes = [
    {
        path: '',
        component: SalesList
    },
    {
        path: 'new',
        component: NewSale
    }
]
