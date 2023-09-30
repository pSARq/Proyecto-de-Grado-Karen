import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrosolictudesComponent } from './registrosolictudes.component';

describe('RegistrosolictudesComponent', () => {
  let component: RegistrosolictudesComponent;
  let fixture: ComponentFixture<RegistrosolictudesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrosolictudesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrosolictudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
