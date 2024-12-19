import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillCounterComponent } from './bill-counter.component';

describe('BillCounterComponent', () => {
  let component: BillCounterComponent;
  let fixture: ComponentFixture<BillCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillCounterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BillCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
