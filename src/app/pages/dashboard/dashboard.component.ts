import { Component, OnInit, OnDestroy, ViewChild, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Employee } from '../../models/user.model';
import { Subscription } from 'rxjs';
import { EmployeeRegistrationModalComponent } from '../employee-registration-modal/employee-registration-modal.component';
import { RecipeRegistrationModalComponent } from '../recipe-registration-modal/recipe-registration-modal.component';
import { PendingPqrsModalComponent } from '../pending-pqr-modal/pending-pqr-modal.component';
import { PqrService } from '../../services/pqr/pqr.service';

// Importación específica de todos los iconos que necesitamos
import { 
  LucideAngularModule, 
  Building, 
  Menu, 
  ChevronDown,
  User, 
  Settings, 
  LogOut, 
  FileText, 
  CheckCircle,
  Mail, 
  Briefcase, 
  Kanban, 
  MoreHorizontal,
  Plus, 
  List, 
  Zap, 
  UserPlus, 
  BookOpen, 
  Pencil,
  X
} from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    EmployeeRegistrationModalComponent, 
    RecipeRegistrationModalComponent, 
    PendingPqrsModalComponent,
    LucideAngularModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild(EmployeeRegistrationModalComponent) registrationModal!: EmployeeRegistrationModalComponent;
  @ViewChild(RecipeRegistrationModalComponent) recipeModal!: RecipeRegistrationModalComponent;
  @ViewChild(PendingPqrsModalComponent) pendingPqrsModal!: PendingPqrsModalComponent;
  @ViewChild('userMenuContent') userMenuContent!: ElementRef;  // Referencia al contenido del menú
  @ViewChild('userMenuButton') userMenuButton!: ElementRef;    // Referencia al botón que abre el menú
  @ViewChild('dropdownButton') dropdownButton!: ElementRef;    // Referencia al botón del dropdown
  @ViewChild('dropdownContent') dropdownContent!: ElementRef;  // Referencia al contenido del dropdown

  employee: Employee | null = null;
  userInitial: string = 'U';
  isAdmin: boolean = false;
  private employeeSubscription!: Subscription;
  pqrs: any[] = [];
  totalPqrs: number = 0;
  unresolvedPqrs: number = 0;
  resolvedPqrs: number = 0;
  resolvedPercentage: number = 0;
  isMenuOpen: boolean = false; // Para controlar el menú en móviles
  isUserMenuOpen: boolean = false;
  isDropdownOpen: boolean = false; // Para el menú dropdown de PQRS

  readonly Building = Building;
  readonly Menu = Menu;
  readonly ChevronDown = ChevronDown;
  readonly User = User;
  readonly Settings = Settings;
  readonly LogOut = LogOut;
  readonly FileText = FileText;
  readonly CheckCircle = CheckCircle;
  readonly Mail = Mail;
  readonly Briefcase = Briefcase;
  readonly Kanban = Kanban;
  readonly MoreHorizontal = MoreHorizontal;
  readonly Plus = Plus;
  readonly List = List;
  readonly Zap = Zap;
  readonly UserPlus = UserPlus;
  readonly BookOpen = BookOpen;
  readonly Pencil = Pencil;
  readonly X = X;

  constructor(
    private authService: AuthService,
    private router: Router,
    private pqrService: PqrService
  ) { }

  @HostListener('document:click', ['\$event'])
  handleClickOutside(event: MouseEvent) {
    // Manejar cierre del menú de usuario
    if (this.isUserMenuOpen) {
      const userMenu = this.userMenuContent?.nativeElement;
      const userButton = this.userMenuButton?.nativeElement;
      
      if (!userMenu?.contains(event.target) && !userButton?.contains(event.target)) {
        this.isUserMenuOpen = false;
      }
    }

    // Manejar cierre del dropdown de PQR
    if (this.isDropdownOpen) {
      const dropdownContent = this.dropdownContent?.nativeElement;
      const dropdownButton = this.dropdownButton?.nativeElement;

      if (!dropdownContent?.contains(event.target) && !dropdownButton?.contains(event.target)) {
        this.isDropdownOpen = false;
      }
    }
  }

  // Método para alternar el menú de usuario
  toggleUserMenu(event: Event) {
    event.stopPropagation();
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  // Método para alternar el dropdown de PQR
  toggleDropdown(event?: Event) {
    if (event) event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

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
    if (this.employeeSubscription) {
      this.employeeSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getUserFirstName(): string {
    return this.employee?.userName?.split(' ')[0] || 'Usuario';
  }

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
        this.totalPqrs = this.pqrs.length;
        this.unresolvedPqrs = this.pqrs.filter(p => p.status === 'SIN RESOLVER').length;
        this.resolvedPqrs = this.pqrs.filter(p => p.status === 'RESUELTO').length;
        this.resolvedPercentage = this.totalPqrs > 0 
          ? Math.round((this.resolvedPqrs / this.totalPqrs) * 100) 
          : 0;
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
    console.log('PQR resuelto:', response);
    this.loadPqrs();
    alert('¡Solicitud resuelta exitosamente!');
  }

  handleModalClosed(): void {
    console.log('Modal cerrado - recargando datos');
    this.loadPqrs();
  }
}