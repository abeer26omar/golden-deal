import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccoutSettingComponent } from './accout-setting.component';

describe('AccoutSettingComponent', () => {
  let component: AccoutSettingComponent;
  let fixture: ComponentFixture<AccoutSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccoutSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccoutSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
