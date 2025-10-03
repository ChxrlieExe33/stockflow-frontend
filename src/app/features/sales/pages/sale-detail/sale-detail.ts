import {Component, input} from '@angular/core';
import {SaleInfoModel} from '../../../../core/models/sales/sale-info.model';
import {DatePipe} from '@angular/common';
import {CapitalizeFirstPipe} from '../../../../shared/pipes/capitalize-first.pipe';

@Component({
  selector: 'app-sale-detail',
    imports: [
        DatePipe,
        CapitalizeFirstPipe
    ],
  templateUrl: './sale-detail.html',
  styleUrl: './sale-detail.css'
})
export class SaleDetail {

    // From the resolver and wired with component input binding.
    sale = input.required<SaleInfoModel>();

}
