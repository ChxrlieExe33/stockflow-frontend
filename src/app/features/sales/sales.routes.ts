import {Routes} from '@angular/router';
import {SalesList} from './pages/sales-list/sales-list';
import {NewSale} from './pages/new-sale/new-sale';
import {SaleDetail} from './pages/sale-detail/sale-detail';
import {saleDetailResolver} from './resolvers/sales.resolver';

export const salesRoutes : Routes = [
    {
        path: '',
        component: SalesList
    },
    {
        path: 'new',
        component: NewSale
    },
    {
        path: 'detail/:saleId',
        component: SaleDetail,
        resolve: {
            sale: saleDetailResolver
        }
    }
]
