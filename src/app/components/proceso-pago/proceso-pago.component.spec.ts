import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesoPagoComponent } from './proceso-pago.component';

describe('ProcesoPagoComponent', () => {
  let component: ProcesoPagoComponent;
  let fixture: ComponentFixture<ProcesoPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcesoPagoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProcesoPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
