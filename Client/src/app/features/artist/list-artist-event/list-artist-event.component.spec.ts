import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListArtistEventComponent } from './list-artist-event.component';

describe('ListArtistEventComponent', () => {
  let component: ListArtistEventComponent;
  let fixture: ComponentFixture<ListArtistEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListArtistEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListArtistEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
