import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertonesComponent } from './ofertones.component';

describe('OfertonesComponent', () => {
  let component: OfertonesComponent;
  let fixture: ComponentFixture<OfertonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfertonesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OfertonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
