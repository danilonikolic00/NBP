import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateDialogComponent } from './rate-dialog.component';

describe('RateDialogComponent', () => {
  let component: RateDialogComponent;
  let fixture: ComponentFixture<RateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
