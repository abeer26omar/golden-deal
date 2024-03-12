import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraMediaComponent } from './camera-media.component';

describe('CameraMediaComponent', () => {
  let component: CameraMediaComponent;
  let fixture: ComponentFixture<CameraMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CameraMediaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CameraMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
