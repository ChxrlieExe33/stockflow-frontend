import {Component, input} from '@angular/core';
import {Product} from '../../../../core/models/products/product.model';
import {CapitalizeFirstPipe} from '../../../../shared/pipes/capitalize-first.pipe';
import {ProductInstance} from '../../../../core/models/products/product-instance.model';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-product-instances',
    imports: [
        CapitalizeFirstPipe,
        DatePipe
    ],
  templateUrl: './product-instances.html',
  styleUrl: './product-instances.css'
})
export class ProductInstances {

    product = input.required<Product>();
    instances = input.required<ProductInstance[]>();

}
