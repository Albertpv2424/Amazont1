import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendedorEstadisticasComponent } from './vendedor-estadisticas.component';

describe('VendedorEstadisticasComponent', () => {
  let component: VendedorEstadisticasComponent;
  let fixture: ComponentFixture<VendedorEstadisticasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendedorEstadisticasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VendedorEstadisticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
