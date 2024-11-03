import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProizvodAddDialogComponent } from './proizvod-add-dialog.component';

describe('ProizvodAddDialogComponent', () => {
  let component: ProizvodAddDialogComponent;
  let fixture: ComponentFixture<ProizvodAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProizvodAddDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProizvodAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
