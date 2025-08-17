import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private baseUrl = environment.apiUrl + '/dev';

  constructor(private http: HttpClient) { }


  // Añadir una nueva receta
  addRecipe(recipeData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/employees/add-recipes`, recipeData);
  }
}