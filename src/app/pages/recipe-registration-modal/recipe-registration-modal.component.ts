import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RecipeService } from '../../services/recipes/recipe.service';

@Component({
  selector: 'app-recipe-registration-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './recipe-registration-modal.component.html',
  styleUrls: ['./recipe-registration-modal.component.css']
})
export class RecipeRegistrationModalComponent implements OnInit {
  @Output() recipeAdded = new EventEmitter<any>();
  
  recipeForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  isVisible = false;
  registrationMode: 'single' | 'bulk' = 'single';
  
  // Variables para la carga de archivo
  fileUploaded = false;
  fileName = '';
  recipesInFile = 0;
  recipeFileContent: any[] = [];
  fileInputId = 'recipeFile_' + Math.random().toString(36).substring(2, 9); // ID único
  
  // Nuevas variables para los pasos de receta
  recipeSteps: string[] = [];
  newStep: string = '';
  showStepsError: boolean = false;
  
  // Categorías con IDs
  categories = [
    { id: 1, name: 'Desayuno' },
    { id: 2, name: 'Almuerzo' },
    { id: 3, name: 'Cena' },
    { id: 4, name: 'Comida rapida' }
  ];

  // Dificultades con IDs
  difficulties = [
    { id: 1, name: 'Fácil' },
    { id: 2, name: 'Intermedio' },
    { id: 3, name: 'Difícil' },
  ];

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      ingredients: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      // El campo steps ya no es necesario en el formulario ya que usaremos recipeSteps
      categoryId: ['', Validators.required],
      difficultyId: ['', Validators.required]
    });
    
    // Reiniciar variables de pasos
    this.recipeSteps = [];
    this.newStep = '';
    this.showStepsError = false;
    
    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = false;
    
    // Reiniciar variables de archivo
    this.resetFileInput();
  }

  // Método para agregar un nuevo paso
  addStep(): void {
    if (this.newStep.trim()) {
      this.recipeSteps.push(this.newStep.trim());
      this.newStep = ''; // Limpiar el input
      this.showStepsError = false; // Ocultar mensaje de error si estaba visible
    }
  }

  // Método para eliminar un paso
  removeStep(index: number): void {
    this.recipeSteps.splice(index, 1);
  }

  // Método simplificado para resetear todo lo relacionado con el archivo
  resetFileInput(): void {
    this.fileUploaded = false;
    this.fileName = '';
    this.recipeFileContent = [];
    this.recipesInFile = 0;
    
    // Generar un nuevo ID único para el input de archivo
    this.fileInputId = 'recipeFile_' + Math.random().toString(36).substring(2, 9);
  }

  setRegistrationMode(mode: 'single' | 'bulk'): void {
    this.registrationMode = mode;
    this.errorMessage = '';
    this.successMessage = '';
    this.resetFileInput();
  }

  open(): void {
    this.isVisible = true;
    this.initializeForm(); // Reset the form when opening
    document.body.classList.add('modal-open'); // Prevent background scrolling
  }

  close(): void {
    this.isVisible = false;
    document.body.classList.remove('modal-open');
  }

  onSubmit(): void {
    if (this.recipeForm.invalid) {
      this.recipeForm.markAllAsTouched();
      return;
    }

    // Validar que haya al menos un paso
    if (this.recipeSteps.length === 0) {
      this.showStepsError = true;
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Convertir los pasos a una cadena formateada (1. paso1 2. paso2...)
    const formattedSteps = this.recipeSteps
      .map((step, index) => `${index + 1}. ${step}`)
      .join(' ');

    // Crear el objeto con la estructura que espera tu API
    const recipeData = {
      TITULO: this.recipeForm.value.title,
      INGREDIENTES: this.recipeForm.value.ingredients,
      DURACION: this.recipeForm.value.duration,
      PASO_A_PASO: formattedSteps, // Usar los pasos formateados
      ID_CATEGORIA: this.recipeForm.value.categoryId,
      ID_DIFICULTAD: this.recipeForm.value.difficultyId
    };

    // Usar el mismo servicio para una receta individual
    this.recipeService.addRecipe(recipeData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage = '¡Receta registrada exitosamente!';
        this.recipeAdded.emit(response);
        this.recipeForm.reset();
        this.recipeSteps = []; // Limpiar los pasos
        this.showStepsError = false;
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'Ocurrió un error al registrar la receta';
        console.error('Error al registrar la receta:', error);
      }
    });
  }

  handleFileInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;
    
    this.errorMessage = '';
    this.successMessage = '';
    
    if (!files || files.length === 0) {
      this.fileUploaded = false;
      this.fileName = '';
      this.recipeFileContent = [];
      this.recipesInFile = 0;
      return;
    }
    
    const file = files[0];
    this.fileName = file.name;
    
    // Verificar que es un archivo .txt o .json
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.json')) {
      this.errorMessage = 'El archivo debe ser de formato .txt o .json';
      this.fileUploaded = false;
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        // Intentar parsear el contenido como JSON
        let content;
        try {
          content = JSON.parse(e.target.result);
        } catch (parseError) {
          throw new Error('El archivo no contiene un formato JSON válido');
        }
        
        // Si el contenido no es un array pero es un objeto, intenta envolverlo en un array
        if (!Array.isArray(content)) {
          if (typeof content === 'object' && content !== null) {
            content = [content];
          } else {
            throw new Error('El archivo debe contener un array de recetas');
          }
        }
        
        // Validar y preparar las recetas
        const validRecipes: any[] = [];
        const invalidRecipes = [];
        
        content.forEach(recipe => {
          // Verificar que todos los campos requeridos existan y no sean nulos
          if (recipe.TITULO && recipe.INGREDIENTES && recipe.DURACION && recipe.PASO_A_PASO && 
              recipe.ID_CATEGORIA !== null && recipe.ID_CATEGORIA !== undefined && 
              recipe.ID_DIFICULTAD !== null && recipe.ID_DIFICULTAD !== undefined) {
            validRecipes.push(recipe);
          } else {
            invalidRecipes.push(recipe);
          }
        });
        
        if (validRecipes.length === 0) {
          throw new Error('No se encontraron recetas válidas en el archivo. Todas las recetas deben tener todos los campos requeridos.');
        }
        
        this.recipeFileContent = validRecipes;
        this.recipesInFile = validRecipes.length;
        this.fileUploaded = true;
        
        let message = `Archivo cargado exitosamente: \${validRecipes.length} recetas encontradas`;
        
        if (invalidRecipes.length > 0) {
          message += `. Se omitieron ${invalidRecipes.length} recetas que no tenían todos los campos requeridos o tenían campos nulos.`;
        }
        
        this.successMessage = message;
        
      } catch (error: any) {
        this.errorMessage = `Error al procesar el archivo: \${error.message || 'Formato inválido'}`;
        this.fileUploaded = false;
        this.recipesInFile = 0;
        this.recipeFileContent = [];
      }
    };
    
    reader.readAsText(file);
  }

  uploadBulkRecipes(): void {
    if (!this.fileUploaded || this.recipeFileContent.length === 0) {
      this.errorMessage = 'No hay recetas válidas para cargar';
      return;
    }
    
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    // Usar el mismo servicio para un array de recetas
    this.recipeService.addRecipe(this.recipeFileContent).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage = `¡${this.recipeFileContent.length} recetas registradas exitosamente!`;
        this.recipeAdded.emit(response);
        
        // Resetear completamente el input de archivo
        this.resetFileInput();
        
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'Ocurrió un error al registrar las recetas';
        console.error('Error al registrar recetas en bloque:', error);
      }
    });
  }
}