import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingContainer } from './landing-container';

describe('LandingContainer', () => {
  let component: LandingContainer;
  let fixture: ComponentFixture<LandingContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
