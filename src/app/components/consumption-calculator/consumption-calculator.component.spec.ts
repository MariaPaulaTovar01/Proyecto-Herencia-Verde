import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumptionCalculatorComponent } from './consumption-calculator.component';

describe('ConsumptionCalculatorComponent', () => {
  let component: ConsumptionCalculatorComponent;
  let fixture: ComponentFixture<ConsumptionCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumptionCalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumptionCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
