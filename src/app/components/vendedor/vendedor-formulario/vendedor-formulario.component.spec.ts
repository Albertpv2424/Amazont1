import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendedorFormularioComponent } from './vendedor-formulario.component';

describe('VendedorFormularioComponent', () => {
  let component: VendedorFormularioComponent;
  let fixture: ComponentFixture<VendedorFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendedorFormularioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VendedorFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
