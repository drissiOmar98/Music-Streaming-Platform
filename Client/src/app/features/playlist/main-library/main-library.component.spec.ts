import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainLibraryComponent } from './main-library.component';

describe('MainLibraryComponent', () => {
  let component: MainLibraryComponent;
  let fixture: ComponentFixture<MainLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLibraryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
