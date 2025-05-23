import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicItemComponent } from './music-item.component';

describe('MusicItemComponent', () => {
  let component: MusicItemComponent;
  let fixture: ComponentFixture<MusicItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusicItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MusicItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
