import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KategorijaDialogComponent } from './kategorija-dialog.component';

describe('KategorijaDialogComponent', () => {
  let component: KategorijaDialogComponent;
  let fixture: ComponentFixture<KategorijaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KategorijaDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KategorijaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
