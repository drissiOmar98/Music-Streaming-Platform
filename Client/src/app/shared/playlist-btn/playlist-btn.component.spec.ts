import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistBtnComponent } from './playlist-btn.component';

describe('PlaylistBtnComponent', () => {
  let component: PlaylistBtnComponent;
  let fixture: ComponentFixture<PlaylistBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistBtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaylistBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
