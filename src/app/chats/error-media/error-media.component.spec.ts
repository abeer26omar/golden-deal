import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorMediaComponent } from './error-media.component';

describe('ErrorMediaComponent', () => {
  let component: ErrorMediaComponent;
  let fixture: ComponentFixture<ErrorMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorMediaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
