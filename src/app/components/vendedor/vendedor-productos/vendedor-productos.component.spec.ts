import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendedorProductosComponent } from './vendedor-productos.component';

describe('VendedorProductosComponent', () => {
  let component: VendedorProductosComponent;
  let fixture: ComponentFixture<VendedorProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendedorProductosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VendedorProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
