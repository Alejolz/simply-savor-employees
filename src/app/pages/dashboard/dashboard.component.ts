import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Employee } from '../../models/user.model';
import { Subscription } from 'rxjs';
import { EmployeeRegistrationModalComponent } from '../employee-registration-modal/employee-registration-modal.component';
import { RecipeRegistrationModalComponent } from '../recipe-registration-modal/recipe-registration-modal.component';
import { PendingPqrsModalComponent } from '../pending-pqr-modal/pending-pqr-modal.component';
import { PqrService } from '../../services/pqr/pqr.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, EmployeeRegistrationModalComponent, RecipeRegistrationModalComponent, PendingPqrsModalComponent], // Añadir aquí el modal
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild(EmployeeRegistrationModalComponent) registrationModal!: EmployeeRegistrationModalComponent;
  @ViewChild(RecipeRegistrationModalComponent) recipeModal!: RecipeRegistrationModalComponent;
  @ViewChild(PendingPqrsModalComponent) pendingPqrsModal!: PendingPqrsModalComponent;

  employee: Employee | null = null;
  userInitial: string = 'U';
  isAdmin: boolean = false;
  private employeeSubscription!: Subscription;
  pqrs: any[] = []
  totalPqrs: number = 0;
  unresolvedPqrs: number = 0;
  resolvedPqrs: number = 0;
  resolvedPercentage: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private pqrService: PqrService
  ) { }

  ngOnInit(): void {

    this.loadPqrs();
    // Obtener datos del empleado actual
    this.employee = this.authService.getCurrentEmployee();
    if (this.employee) {
      this.userInitial = this.employee.userName.charAt(0).toUpperCase();
      // Verificar si el rol es "Administrador"
      this.isAdmin = this.employee.employeeRole === 'Administrador';
    }

    // Suscribirse a cambios en el empleado actual
    this.employeeSubscription = this.authService.currentEmployee.subscribe(employee => {
      this.employee = employee;
      if (employee) {
        this.userInitial = employee.userName.charAt(0).toUpperCase();
        this.isAdmin = employee.employeeRole === 'Administrador';
      }
    });
  }

  ngOnDestroy(): void {
    // Limpieza de suscripciones para evitar memory leaks
    if (this.employeeSubscription) {
      this.employeeSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Método seguro para obtener el nombre del usuario
  getUserFirstName(): string {
    return this.employee?.userName?.split(' ')[0] || 'Usuario';
  }

  // Método para abrir el modal de registro
  openRegistrationModal(): void {
    if (this.registrationModal) {
      this.registrationModal.open();
    }
  }

  openRecipesModal(): void {
    if (this.recipeModal) {
      this.recipeModal.open();
    }
  }

  handleEmployeeAdded(response: any): void {
    console.log('Empleado registrado:', response);

    // Mostrar una alerta simple con el mensaje de éxito
    if (response && response.code === 'SR01') {
      alert('¡Usuario creado exitosamente!');
    } else {
      alert('Empleado registrado correctamente.');
    }
  }

  handleRecipeAdded(response: any): void {
    console.log('Recetas registrada:', response);
    alert('¡Receta registrada exitosamente!');
  }

  loadPqrs(): void {
    this.pqrService.getAllPQR().subscribe({
      next: (response) => {
        console.log('PQRs cargados:', response);
        this.pqrs = response.data || [];

        // 👉 Calcular índices
        this.totalPqrs = this.pqrs.length;
        this.unresolvedPqrs = this.pqrs.filter(p => p.status === 'SIN RESOLVER').length;
        this.resolvedPqrs = this.pqrs.filter(p => p.status === 'RESUELTO').length;

        this.resolvedPercentage = this.totalPqrs > 0 
          ? Math.round((this.resolvedPqrs / this.totalPqrs) * 100) 
          : 0;

        console.log('Totales:', {
          total: this.totalPqrs,
          sinResolver: this.unresolvedPqrs,
          resueltos: this.resolvedPqrs
        });
      },
      error: (err) => {
        console.error('Error al cargar los PQR:', err);
      }
    });
  }

  openPendingPqrsModal(): void {
    if (this.pendingPqrsModal) {
      this.pendingPqrsModal.open();
    }
  }

  handlePqrResolved(response: any): void {
    // console.log('PQR resuelto:', response);
    
    // // Recargar los datos de PQRs para actualizar los contadores
    // this.loadPqrs();
    
    // // Mostrar alerta de éxito
    // alert('¡Solicitud resuelta exitosamente!');
  }

  handleModalClosed(): void {
    console.log('Modal cerrado - recargando datos');
    this.loadPqrs(); // Recargar los datos
  }
}