import {Component, input} from '@angular/core';
import {CapitalizeFirstPipe} from "../../../../shared/pipes/capitalize-first.pipe";
import {DatePipe} from "@angular/common";
import {Product} from '../../../../core/models/products/product.model';

@Component({
  selector: 'app-product-detail-header',
    imports: [
        CapitalizeFirstPipe,
        DatePipe
    ],
  templateUrl: './product-detail-header.html',
  styleUrl: './product-detail-header.css'
})
export class ProductDetailHeader {

    product = input.required<Product>();
}
