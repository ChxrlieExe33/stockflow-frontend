import {Routes} from '@angular/router';
import {CreateProduct} from './pages/create-product/create-product';
import {ProductDetail} from './pages/product-detail/product-detail';
import {productDetailResolver} from './resolvers/product.resolver';
import {ProductSearch} from './pages/product-search/product-search';

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
    },
    {
        path: "search",
        component: ProductSearch
    }
]
