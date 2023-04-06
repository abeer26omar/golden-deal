import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseModalErrorComponent } from './response-modal-error.component';

describe('ResponseModalErrorComponent', () => {
  let component: ResponseModalErrorComponent;
  let fixture: ComponentFixture<ResponseModalErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponseModalErrorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponseModalErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
