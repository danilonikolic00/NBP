import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KorpaDialogComponent } from './korpa-dialog.component';

describe('KorpaDialogComponent', () => {
  let component: KorpaDialogComponent;
  let fixture: ComponentFixture<KorpaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KorpaDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KorpaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
