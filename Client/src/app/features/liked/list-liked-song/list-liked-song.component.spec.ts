import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLikedSongComponent } from './list-liked-song.component';

describe('ListLikedSongComponent', () => {
  let component: ListLikedSongComponent;
  let fixture: ComponentFixture<ListLikedSongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListLikedSongComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListLikedSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
