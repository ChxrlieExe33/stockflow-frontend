import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesListTable } from './sales-list-table';

describe('SalesListTable', () => {
  let component: SalesListTable;
  let fixture: ComponentFixture<SalesListTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesListTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesListTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
