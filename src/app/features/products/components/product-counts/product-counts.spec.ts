import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCounts } from './product-counts';

describe('ProductCounts', () => {
  let component: ProductCounts;
  let fixture: ComponentFixture<ProductCounts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCounts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCounts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
