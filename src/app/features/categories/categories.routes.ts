import {CategoriesList} from './pages/categories-list/categories-list';
import {NotFound} from './pages/not-found/not-found';
import {CategoryDetail} from './pages/category-detail/category-detail';
import {categoryDetailResolver} from '../../core/resolvers/category.resolver';

export const categoriesRoutes = [
    {
        path: "",
        component: CategoriesList
    },
    {
        path: "detail/:categoryId",
        component: CategoryDetail,
        resolve: {
            category: categoryDetailResolver
        }
    },
    {
        path: "not-found",
        component: NotFound
    }
]
