import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentEmployeeSubject = new BehaviorSubject<Employee | null>(null);
  public currentEmployee: Observable<Employee | null> = this.currentEmployeeSubject.asObservable();
  private sessionKey: string | null = null;

  constructor() {
    // Recuperar datos de empleado del localStorage si existe
    const savedEmployee = localStorage.getItem('currentEmployee');
    const savedSession = localStorage.getItem('sessionKey');
    
    if (savedEmployee) {
      this.currentEmployeeSubject.next(JSON.parse(savedEmployee));
      this.sessionKey = savedSession;
    }
  }

  // Método para obtener el empleado actual sin usar el operador \$
  getCurrentEmployee(): Employee | null {
    return this.currentEmployeeSubject.value;
  }

  setEmployeeSession(employee: Employee, sessionKey: string): void {
    // Guardar información del empleado y la sesión
    this.currentEmployeeSubject.next(employee);
    this.sessionKey = sessionKey;
    
    // Persistir en localStorage
    localStorage.setItem('currentEmployee', JSON.stringify(employee));
    localStorage.setItem('sessionKey', sessionKey);
  }

  logout(): void {
    // Limpiar los datos de la sesión
    localStorage.removeItem('currentEmployee');
    localStorage.removeItem('sessionKey');
    this.currentEmployeeSubject.next(null);
    this.sessionKey = null;
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentEmployee() && !!this.sessionKey;
  }
}