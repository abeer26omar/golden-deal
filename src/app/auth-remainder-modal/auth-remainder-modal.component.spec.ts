import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthRemainderModalComponent } from './auth-remainder-modal.component';

describe('AuthRemainderModalComponent', () => {
  let component: AuthRemainderModalComponent;
  let fixture: ComponentFixture<AuthRemainderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthRemainderModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthRemainderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
