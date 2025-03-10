import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikedDetailsComponent } from './liked-details.component';

describe('LikedDetailsComponent', () => {
  let component: LikedDetailsComponent;
  let fixture: ComponentFixture<LikedDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LikedDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LikedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
