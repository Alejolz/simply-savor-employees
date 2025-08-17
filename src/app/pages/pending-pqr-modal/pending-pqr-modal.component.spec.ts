import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingPqrsModalComponent } from './pending-pqr-modal.component';

describe('PendingPqrModalComponent', () => {
  let component: PendingPqrsModalComponent;
  let fixture: ComponentFixture<PendingPqrsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingPqrsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingPqrsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
