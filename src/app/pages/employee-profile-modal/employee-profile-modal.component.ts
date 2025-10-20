import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X, Pencil, Save, User } from 'lucide-angular';
import { Employee } from '../../models/user.model';

@Component({
  selector: 'app-employee-profile-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule
  ],
  templateUrl: './employee-profile-modal.component.html'
})
export class EmployeeProfileModalComponent {
  @Input() employee!: Employee | null;

  readonly X = X;
  readonly Pencil = Pencil;
  readonly Save = Save;
  readonly User = User;

  isOpen: boolean = false;
  isEditing: boolean = false;
  editableEmployee: any = {};

  open() {
    if (!this.employee) return;
    console.log('Opening modal for employee:', this.employee);
    this.isEditing = false;
    this.editableEmployee = { ...this.employee };
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveChanges() {
    localStorage.setItem('currentEmployee', JSON.stringify(this.editableEmployee));
    this.employee = { ...this.editableEmployee };
    this.isEditing = false;
    alert('Perfil actualizado correctamente ✅');
  }
}
