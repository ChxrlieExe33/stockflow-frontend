import {Component, input} from '@angular/core';

@Component({
    selector: 'app-category-detail',
    imports: [],
    templateUrl: './category-detail.html',
    styleUrl: './category-detail.css'
})
export class CategoryDetail {

    // Obtained with resolver and provided via component input binding.
    category = input.required<Category>();

}
