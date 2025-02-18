import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistsTabContentComponent } from './artists-tab-content.component';

describe('ArtistsTabContentComponent', () => {
  let component: ArtistsTabContentComponent;
  let fixture: ComponentFixture<ArtistsTabContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistsTabContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtistsTabContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
