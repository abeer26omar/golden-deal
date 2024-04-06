import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinProductComponent } from './pin-product.component';

describe('PinProductComponent', () => {
  let component: PinProductComponent;
  let fixture: ComponentFixture<PinProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PinProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PinProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
