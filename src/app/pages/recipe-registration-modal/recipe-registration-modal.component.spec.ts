import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeRegistrationModalComponent } from './recipe-registration-modal.component';

describe('RecipeRegistrationModalComponent', () => {
  let component: RecipeRegistrationModalComponent;
  let fixture: ComponentFixture<RecipeRegistrationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeRegistrationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeRegistrationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
