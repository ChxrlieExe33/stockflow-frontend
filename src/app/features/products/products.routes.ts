import {Routes} from '@angular/router';
import {CreateProduct} from './pages/create-product/create-product';
import {ProductDetail} from './pages/product-detail/product-detail';
import {productDetailResolver} from '../../core/resolvers/product.resolver';

export const productRoutes : Routes = [
    {
        path: "create",
        component: CreateProduct
    },
    {
        path: "detail/:productId",
        component: ProductDetail,
        resolve: {
            product: productDetailResolver
        }
    }
]
