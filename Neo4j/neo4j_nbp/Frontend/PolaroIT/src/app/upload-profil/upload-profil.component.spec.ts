import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadProfilComponent } from './upload-profil.component';

describe('UploadProfilComponent', () => {
  let component: UploadProfilComponent;
  let fixture: ComponentFixture<UploadProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadProfilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
