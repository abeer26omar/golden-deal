import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSolidComponent } from './dialog-solid.component';

describe('DialogSolidComponent', () => {
  let component: DialogSolidComponent;
  let fixture: ComponentFixture<DialogSolidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSolidComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSolidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
