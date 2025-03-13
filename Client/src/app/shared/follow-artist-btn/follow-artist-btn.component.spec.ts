import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowArtistBtnComponent } from './follow-artist-btn.component';

describe('FollowArtistBtnComponent', () => {
  let component: FollowArtistBtnComponent;
  let fixture: ComponentFixture<FollowArtistBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowArtistBtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowArtistBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
