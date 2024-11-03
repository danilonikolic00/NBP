import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentionDialogComponent } from './mention-dialog.component';

describe('MentionDialogComponent', () => {
  let component: MentionDialogComponent;
  let fixture: ComponentFixture<MentionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MentionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
