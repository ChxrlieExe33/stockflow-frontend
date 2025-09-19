import {CategoriesList} from './pages/categories-list/categories-list';
import {NotFound} from '../../shared/pages/not-found/not-found';
import {CategoryDetail} from './pages/category-detail/category-detail';
import {categoryDetailResolver} from '../../core/resolvers/category.resolver';
import {CreateCategory} from './pages/create-category/create-category';

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
        path: "create",
        component: CreateCategory
    },
    {
        path: "update/:categoryId",
        component: CreateCategory
    },
    {
        path: "not-found",
        component: NotFound
    }
]
