import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRegistrationModalComponent } from './employee-registration-modal.component';

describe('EmployeeRegistrationModalComponent', () => {
  let component: EmployeeRegistrationModalComponent;
  let fixture: ComponentFixture<EmployeeRegistrationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeRegistrationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeRegistrationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
