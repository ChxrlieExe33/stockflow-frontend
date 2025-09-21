import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailHeader } from './product-detail-header';

describe('ProductDetailHeader', () => {
  let component: ProductDetailHeader;
  let fixture: ComponentFixture<ProductDetailHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
