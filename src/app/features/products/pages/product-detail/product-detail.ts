import {Component, input} from '@angular/core';
import {Product} from '../../../../core/models/products/product.model';
import {CapitalizeFirstPipe} from '../../../../shared/pipes/capitalize-first.pipe';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-product-detail',
    imports: [
        CapitalizeFirstPipe,
        DatePipe
    ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail {

    product = input.required<Product>();

}
