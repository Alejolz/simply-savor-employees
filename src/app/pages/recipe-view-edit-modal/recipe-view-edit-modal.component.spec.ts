import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeViewEditModalComponent } from './recipe-view-edit-modal.component';

describe('RecipeViewEditModalComponent', () => {
  let component: RecipeViewEditModalComponent;
  let fixture: ComponentFixture<RecipeViewEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeViewEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeViewEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
