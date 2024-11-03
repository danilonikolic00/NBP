import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestoranDialogComponent } from './restoran-dialog.component';

describe('RestoranDialogComponent', () => {
  let component: RestoranDialogComponent;
  let fixture: ComponentFixture<RestoranDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestoranDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestoranDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
