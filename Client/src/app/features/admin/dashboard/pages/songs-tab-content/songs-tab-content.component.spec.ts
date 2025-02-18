import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongsTabContentComponent } from './songs-tab-content.component';

describe('SongsTabContentComponent', () => {
  let component: SongsTabContentComponent;
  let fixture: ComponentFixture<SongsTabContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongsTabContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongsTabContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
