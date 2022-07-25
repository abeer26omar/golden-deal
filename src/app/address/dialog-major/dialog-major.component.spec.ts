import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMajorComponent } from './dialog-major.component';

describe('DialogMajorComponent', () => {
  let component: DialogMajorComponent;
  let fixture: ComponentFixture<DialogMajorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMajorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogMajorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
