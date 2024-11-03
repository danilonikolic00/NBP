import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestoraniPanelComponent } from './restorani-panel.component';

describe('RestoraniPanelComponent', () => {
  let component: RestoraniPanelComponent;
  let fixture: ComponentFixture<RestoraniPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestoraniPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestoraniPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
