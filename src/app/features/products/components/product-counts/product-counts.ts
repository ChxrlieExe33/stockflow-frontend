import {Component, input} from '@angular/core';
import {CapitalizeFirstPipe} from "../../../../shared/pipes/capitalize-first.pipe";
import {ProductCount} from '../../services/product-service';
import {Product} from '../../../../core/models/products/product.model';

@Component({
  selector: 'app-product-counts',
    imports: [
        CapitalizeFirstPipe
    ],
  templateUrl: './product-counts.html',
  styleUrl: './product-counts.css'
})
export class ProductCounts {

    product = input.required<Product>();
    counts = input.required<ProductCount[]>();

}
