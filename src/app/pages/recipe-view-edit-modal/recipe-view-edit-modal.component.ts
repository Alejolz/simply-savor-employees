import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RecipeService } from '../../services/recipes/recipe.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recipe-view-edit-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './recipe-view-edit-modal.component.html',
  styleUrl: './recipe-view-edit-modal.component.css'
})
export class RecipeViewEditModalComponent implements OnInit {
  @Output() recipeSelected = new EventEmitter<any>();
  @Output() recipeDeleted = new EventEmitter<number>();
  @Output() addNewRecipe = new EventEmitter<void>();

  isVisible = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Lista de recetas y filtrado
  recipes: any[] = [];
  filteredRecipes: any[] = [];
  selectedRecipe: any = null;

  // Variables para la edición
  isEditMode = false;
  editingRecipe: any = null;

  // Filtros
  searchTerm: string = '';
  selectedCategory: string | null = null;
  selectedDifficulty: number | null = null;

  selectedCategories: string[] = [];


  // Categorías con IDs
  categories = [
    { id: "1", name: 'Desayuno' },
    { id: "2", name: 'Almuerzo' },
    { id: "3", name: 'Cena' },
    { id: "4", name: 'Comida rápida' }
  ];

  // Dificultades con IDs
  difficulties = [
    { id: 1, name: 'Fácil' },
    { id: 2, name: 'Intermedio' },
    { id: 3, name: 'Difícil' },
  ];

  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    // No cargamos recetas aquí para evitar consultas innecesarias
  }

  open(): void {
    this.isVisible = true;
    document.body.classList.add('modal-open');
    this.loadRecipes();
  }

  close(): void {
    this.isVisible = false;
    document.body.classList.remove('modal-open');
    this.selectedRecipe = null;
    this.searchTerm = '';
    this.selectedCategory = null;
    this.selectedDifficulty = null;
    this.isEditMode = false;
    this.editingRecipe = null;
  }

  loadRecipes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.recipeService.getAllRecipes().subscribe({
      next: (response) => {
        // Verifica si la respuesta tiene una estructura con propiedad 'data'
        if (response && response.data && Array.isArray(response.data)) {
          this.recipes = response.data;
        } else if (Array.isArray(response)) {
          // Si la respuesta ya es un array
          this.recipes = response;
        } else {
          // Si no es ninguna de las anteriores, inicializa como array vacío
          this.recipes = [];
          this.errorMessage = 'El formato de la respuesta no es válido';
        }

        this.filteredRecipes = [...this.recipes];
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las recetas: ' + (error.message || 'Intente nuevamente');
        this.isLoading = false;
        // Inicializar arrays en caso de error
        this.recipes = [];
        this.filteredRecipes = [];
      }
    });
  }

  filterRecipes(): void {
  this.filteredRecipes = this.recipes.filter(recipe => {
    // Filtrar por término de búsqueda
    const matchesSearch = this.searchTerm
      ? recipe.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      : true;

    // Filtrar por categorías (pueden ser varias)
    const matchesCategory =
      this.selectedCategories.length > 0
        ? this.selectedCategories.includes(recipe.categoryId)
        : true;

    // Filtrar por dificultad (solo una)
    const matchesDifficulty = this.selectedDifficulty
      ? recipe.difficultyId === this.selectedDifficulty
      : true;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });
}

  filterByCategory(categoryId: string | null): void {
    if (categoryId === null) {
      // Si elige "Todas", limpia el filtro
      this.selectedCategories = [];
    } else {
      // Alternar selección
      const index = this.selectedCategories.indexOf(categoryId);
      if (index > -1) {
        this.selectedCategories.splice(index, 1); // si ya estaba, se quita
      } else {
        this.selectedCategories.push(categoryId); // si no estaba, se agrega
      }
    }

    this.filterRecipes();
  }

  filterByDifficulty(difficultyId: number | null): void {
    this.selectedDifficulty = difficultyId;
    this.filterRecipes();
  }

  removeCategory(categoryId: any): void {
    this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
    this.filterRecipes();
  }

  viewRecipe(recipe: any): void {
    this.selectedRecipe = recipe;
    // Asegurarse de que el modo edición esté desactivado
    this.isEditMode = false;
    this.editingRecipe = null;
  }

  closeRecipeView(): void {
    this.selectedRecipe = null;
    this.isEditMode = false;
    this.editingRecipe = null;
  }

  activateEditMode(): void {
    // Crear una copia profunda del objeto para editar sin modificar el original
    this.editingRecipe = JSON.parse(JSON.stringify(this.selectedRecipe));
    this.isEditMode = true;
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.editingRecipe = null;
  }

  saveRecipeChanges(): void {
    this.isLoading = true;
    this.errorMessage = '';
    const recipeId = this.editingRecipe.id; // Guardamos el ID para referencia

    this.recipeService.updateRecipe(this.editingRecipe.id, this.editingRecipe).subscribe({
      next: (updatedRecipe) => {
        this.successMessage = 'Receta actualizada correctamente';

        // Recargar todas las recetas para asegurar que tenemos los datos más recientes
        this.recipeService.getAllRecipes().subscribe({
          next: (response) => {
            // Verifica si la respuesta tiene una estructura con propiedad 'data'
            if (response && response.data && Array.isArray(response.data)) {
              this.recipes = response.data;
            } else if (Array.isArray(response)) {
              // Si la respuesta ya es un array
              this.recipes = response;
            }

            // Actualizar la lista filtrada
            this.filteredRecipes = [...this.recipes];

            // Buscar y establecer la receta actualizada como la seleccionada
            this.selectedRecipe = this.recipes.find(r => r.id === recipeId);

            // Salir del modo edición
            this.isEditMode = false;
            this.editingRecipe = null;
            this.isLoading = false;
          },
          error: (error) => {
            this.errorMessage = 'Error al recargar las recetas: ' + (error.message || 'Intente nuevamente');
            this.isLoading = false;
          }
        });

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error al actualizar la receta: ' + (error.message || 'Intente nuevamente');

        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  editRecipe(recipe: any): void {
    // Si ya estamos viendo la receta, activamos el modo edición
    if (this.selectedRecipe && this.selectedRecipe.id === recipe.id) {
      this.activateEditMode();
    } else {
      // Si no la estamos viendo, primero cargamos la receta y luego activamos el modo edición
      this.selectedRecipe = recipe;
      this.activateEditMode();
    }
  }

  deleteRecipe(recipeId: number): void {
    if (confirm('¿Está seguro que desea eliminar esta receta? Esta acción no se puede deshacer.')) {
      this.isLoading = true;

      this.recipeService.deleteRecipe(recipeId).subscribe({
        next: () => {
          this.successMessage = 'Receta eliminada correctamente';
          this.loadRecipes(); // Recargar la lista
          this.recipeDeleted.emit(recipeId);

          if (this.selectedRecipe && this.selectedRecipe.id === recipeId) {
            this.selectedRecipe = null;
            this.isEditMode = false;
            this.editingRecipe = null;
          }

          setTimeout(() => {
            this.successMessage = '';
          }, 3000);

          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error al eliminar la receta: ' + (error.message || 'Intente nuevamente');
          this.isLoading = false;

          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
    }
  }

  openRecipeForm(): void {
    this.addNewRecipe.emit();
    // Opcional: cerrar este modal si quieres que solo se muestre un modal a la vez
    this.close();
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Desconocida';
  }

  getDifficultyName(difficultyId: number): string {
    const difficulty = this.difficulties.find(diff => diff.id === difficultyId);
    return difficulty ? difficulty.name : 'Desconocida';
  }

  // Método para formatear los pasos de la receta para mejor visualización
  formatSteps(steps: string): string {
    if (!steps) return '';

    // Reemplazar los números seguidos de punto y espacio con salto de línea
    return steps.replace(/(\d+\.\s)/g, '\n\$1').trim().replace(/^\n/, '');
  }
}