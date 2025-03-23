import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListArtistSongComponent } from './list-artist-song.component';

describe('ListArtistSongComponent', () => {
  let component: ListArtistSongComponent;
  let fixture: ComponentFixture<ListArtistSongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListArtistSongComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListArtistSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
