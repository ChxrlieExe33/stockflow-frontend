import {Routes} from '@angular/router';
import {SalesList} from './pages/sales-list/sales-list';
import {NewSale} from './pages/new-sale/new-sale';
import {SaleDetail} from './pages/sale-detail/sale-detail';
import {saleDetailResolver} from './resolvers/sales.resolver';
import {UpdateSale} from './pages/update-sale/update-sale';

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
    },
    {
        path: 'update/:saleId',
        component: UpdateSale,
        resolve: {
            sale: saleDetailResolver
        }
    }
]
