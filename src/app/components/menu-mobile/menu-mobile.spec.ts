import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuMobile } from './menu-mobile';

describe('MenuMobile', () => {
  let component: MenuMobile;
  let fixture: ComponentFixture<MenuMobile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuMobile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
