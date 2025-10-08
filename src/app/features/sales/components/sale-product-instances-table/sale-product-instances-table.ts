import {Component, EventEmitter, input, Output} from '@angular/core';
import {CapitalizeFirstPipe} from "../../../../shared/pipes/capitalize-first.pipe";
import {InstanceData} from '../../../../core/models/sales/sale-product-instance-data.model';

@Component({
  selector: 'app-sale-product-instances-table',
    imports: [
        CapitalizeFirstPipe
    ],
  templateUrl: './sale-product-instances-table.html',
  styleUrl: './sale-product-instances-table.css'
})
export class SaleProductInstancesTable {

    instances = input.required<InstanceData[]>();
    displayRemoveButton = input.required<boolean>();

    @Output() removeInstanceClicked = new EventEmitter<number>();

}
