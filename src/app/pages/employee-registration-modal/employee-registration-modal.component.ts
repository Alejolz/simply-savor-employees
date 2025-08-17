import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/users/user.service';

@Component({
  selector: 'app-employee-registration-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './employee-registration-modal.component.html',
  styleUrls: ['./employee-registration-modal.component.css']
})
export class EmployeeRegistrationModalComponent implements OnInit {
  @Output() employeeAdded = new EventEmitter<any>();
  
  employeeForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  isVisible = false;
  
  identificationTypes = [
    { value: 'CC', text: 'Cédula de Ciudadanía' },
    { value: 'CE', text: 'Cédula de Extranjería' },
    { value: 'TI', text: 'Tarjeta de Identidad' },
    { value: 'Pasaporte', text: 'Pasaporte' }
  ];

  employeeRoles = [
    { value: 'Administrador', text: 'Administrador' },
    { value: 'Supervisor', text: 'Supervisor' },
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.employeeForm = this.fb.group({
      userName: ['', Validators.required],
      employeeEmail: ['', [Validators.required, Validators.email]],
      employeePhone: ['', Validators.required],
      employeeIdentification: ['', Validators.required],
      identificationType: ['', Validators.required],
      employeeRole: ['', Validators.required],
      employeePassword: ['', [Validators.required, Validators.minLength(8)]]
    });
    this.errorMessage = '';
    this.isSubmitting = false;
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
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.userService.registerEmployee(this.employeeForm.value).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.employeeAdded.emit(response);
        this.close();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'Ocurrió un error al registrar al empleado';
        console.error('Error al registrar empleado:', error);
      }
    });
  }
}