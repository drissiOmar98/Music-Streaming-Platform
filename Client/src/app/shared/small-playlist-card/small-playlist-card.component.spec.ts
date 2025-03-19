import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallPlaylistCardComponent } from './small-playlist-card.component';

describe('SmallPlaylistCardComponent', () => {
  let component: SmallPlaylistCardComponent;
  let fixture: ComponentFixture<SmallPlaylistCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmallPlaylistCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmallPlaylistCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
