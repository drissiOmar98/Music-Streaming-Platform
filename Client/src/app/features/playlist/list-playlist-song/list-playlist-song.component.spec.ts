import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPlaylistSongComponent } from './list-playlist-song.component';

describe('ListPlaylistSongComponent', () => {
  let component: ListPlaylistSongComponent;
  let fixture: ComponentFixture<ListPlaylistSongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPlaylistSongComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPlaylistSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
