import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavMenuMobile } from './nav-menu-mobile';

describe('NavMenuMobile', () => {
  let component: NavMenuMobile;
  let fixture: ComponentFixture<NavMenuMobile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavMenuMobile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavMenuMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
