import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserlistDialogComponent } from './userlist-dialog.component';

describe('UserlistDialogComponent', () => {
  let component: UserlistDialogComponent;
  let fixture: ComponentFixture<UserlistDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserlistDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserlistDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
