import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateMarketingComponent } from './private-marketing.component';

describe('PrivateMarketingComponent', () => {
  let component: PrivateMarketingComponent;
  let fixture: ComponentFixture<PrivateMarketingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivateMarketingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivateMarketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
