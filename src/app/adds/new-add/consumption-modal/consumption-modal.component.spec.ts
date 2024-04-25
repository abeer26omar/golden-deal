import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumptionModalComponent } from './consumption-modal.component';

describe('ConsumptionModalComponent', () => {
  let component: ConsumptionModalComponent;
  let fixture: ComponentFixture<ConsumptionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumptionModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
