import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsBannerComponent } from './adds-banner.component';

describe('AddsBannerComponent', () => {
  let component: AddsBannerComponent;
  let fixture: ComponentFixture<AddsBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddsBannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddsBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
