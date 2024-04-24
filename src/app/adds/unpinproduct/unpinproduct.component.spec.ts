import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpinproductComponent } from './unpinproduct.component';

describe('UnpinproductComponent', () => {
  let component: UnpinproductComponent;
  let fixture: ComponentFixture<UnpinproductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnpinproductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnpinproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
