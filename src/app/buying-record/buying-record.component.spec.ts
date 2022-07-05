import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyingRecordComponent } from './buying-record.component';

describe('BuyingRecordComponent', () => {
  let component: BuyingRecordComponent;
  let fixture: ComponentFixture<BuyingRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyingRecordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyingRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
