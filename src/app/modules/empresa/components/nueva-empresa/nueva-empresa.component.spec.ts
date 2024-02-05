import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaEmpresaComponent } from './nueva-empresa.component';

describe('NuevaEmpresaComponent', () => {
  let component: NuevaEmpresaComponent;
  let fixture: ComponentFixture<NuevaEmpresaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NuevaEmpresaComponent]
    });
    fixture = TestBed.createComponent(NuevaEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
