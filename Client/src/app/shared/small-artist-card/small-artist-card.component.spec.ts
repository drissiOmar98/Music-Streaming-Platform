import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallArtistCardComponent } from './small-artist-card.component';

describe('SmallArtistCardComponent', () => {
  let component: SmallArtistCardComponent;
  let fixture: ComponentFixture<SmallArtistCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmallArtistCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmallArtistCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
