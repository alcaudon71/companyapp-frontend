import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoMercadoComponent } from './nuevo-mercado.component';

describe('NuevoMercadoComponent', () => {
  let component: NuevoMercadoComponent;
  let fixture: ComponentFixture<NuevoMercadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NuevoMercadoComponent]
    });
    fixture = TestBed.createComponent(NuevoMercadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
