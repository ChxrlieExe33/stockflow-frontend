import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInstances } from './product-instances';

describe('ProductInstances', () => {
  let component: ProductInstances;
  let fixture: ComponentFixture<ProductInstances>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductInstances]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductInstances);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
