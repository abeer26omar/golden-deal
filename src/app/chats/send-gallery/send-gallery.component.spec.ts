import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendGalleryComponent } from './send-gallery.component';

describe('SendGalleryComponent', () => {
  let component: SendGalleryComponent;
  let fixture: ComponentFixture<SendGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendGalleryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
