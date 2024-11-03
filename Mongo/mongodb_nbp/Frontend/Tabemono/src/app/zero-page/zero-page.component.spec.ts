import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZeroPageComponent } from './zero-page.component';

describe('ZeroPageComponent', () => {
  let component: ZeroPageComponent;
  let fixture: ComponentFixture<ZeroPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZeroPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZeroPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
