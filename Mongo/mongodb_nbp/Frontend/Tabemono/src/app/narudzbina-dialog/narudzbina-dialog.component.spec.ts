import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NarudzbinaDialogComponent } from './narudzbina-dialog.component';

describe('NarudzbinaDialogComponent', () => {
  let component: NarudzbinaDialogComponent;
  let fixture: ComponentFixture<NarudzbinaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NarudzbinaDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NarudzbinaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
