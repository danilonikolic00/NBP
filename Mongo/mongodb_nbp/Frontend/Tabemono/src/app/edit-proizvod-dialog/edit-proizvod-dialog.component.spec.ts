import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProizvodDialogComponent } from './edit-proizvod-dialog.component';

describe('EditProizvodDialogComponent', () => {
  let component: EditProizvodDialogComponent;
  let fixture: ComponentFixture<EditProizvodDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProizvodDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProizvodDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
