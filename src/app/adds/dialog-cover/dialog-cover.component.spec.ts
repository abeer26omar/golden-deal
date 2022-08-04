import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCoverComponent } from './dialog-cover.component';

describe('DialogCoverComponent', () => {
  let component: DialogCoverComponent;
  let fixture: ComponentFixture<DialogCoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCoverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
