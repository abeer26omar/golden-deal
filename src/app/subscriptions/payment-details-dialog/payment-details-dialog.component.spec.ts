import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDetailsDialogComponent } from './payment-details-dialog.component';

describe('PaymentDetailsDialogComponent', () => {
  let component: PaymentDetailsDialogComponent;
  let fixture: ComponentFixture<PaymentDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentDetailsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
