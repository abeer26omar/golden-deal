import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendPdfComponent } from './send-pdf.component';

describe('SendPdfComponent', () => {
  let component: SendPdfComponent;
  let fixture: ComponentFixture<SendPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendPdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
