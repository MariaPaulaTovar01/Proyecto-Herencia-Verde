import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolarInfoComponent } from './solar-info.component';

describe('SolarInfoComponent', () => {
  let component: SolarInfoComponent;
  let fixture: ComponentFixture<SolarInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolarInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolarInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
