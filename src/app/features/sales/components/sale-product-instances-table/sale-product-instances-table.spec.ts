import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleProductInstancesTable } from './sale-product-instances-table';

describe('SaleProductInstancesTable', () => {
  let component: SaleProductInstancesTable;
  let fixture: ComponentFixture<SaleProductInstancesTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleProductInstancesTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleProductInstancesTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
