import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveDelivery } from './receive-delivery';

describe('ReceiveDelivery', () => {
  let component: ReceiveDelivery;
  let fixture: ComponentFixture<ReceiveDelivery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiveDelivery]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiveDelivery);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
