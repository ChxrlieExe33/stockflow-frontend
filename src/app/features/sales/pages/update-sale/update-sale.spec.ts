import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSale } from './update-sale';

describe('UpdateSale', () => {
  let component: UpdateSale;
  let fixture: ComponentFixture<UpdateSale>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateSale]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateSale);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
