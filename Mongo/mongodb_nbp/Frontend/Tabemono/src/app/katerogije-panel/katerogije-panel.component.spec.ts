import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KaterogijePanelComponent } from './katerogije-panel.component';

describe('KaterogijePanelComponent', () => {
  let component: KaterogijePanelComponent;
  let fixture: ComponentFixture<KaterogijePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KaterogijePanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KaterogijePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
