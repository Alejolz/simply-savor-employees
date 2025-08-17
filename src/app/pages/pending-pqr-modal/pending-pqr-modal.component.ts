import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PqrService } from '../../services/pqr/pqr.service';

@Component({
  selector: 'app-pending-pqrs-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pending-pqr-modal.component.html',
  styleUrls: ['./pending-pqr-modal.component.css']
})
export class PendingPqrsModalComponent implements OnInit {
  @Output() pqrResolved = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();
  
  isVisible = false;
  pendingPqrs: any[] = [];
  currentIndex = 0;
  currentPqr: any = null;
  solutionText = '';
  loading = false;
  
  constructor(private pqrService: PqrService) {}

  ngOnInit(): void {}

  open(): void {
    this.isVisible = true;
    this.loadPendingPqrs();
  }

  close(): void {
    this.isVisible = false;
    this.currentIndex = 0;
    this.currentPqr = null;
    this.solutionText = '';

    this.modalClosed.emit();
  }

  loadPendingPqrs(): void {
    this.loading = true;
    this.pqrService.getAllPQR().subscribe({
      next: (response) => {
        if (response.data) {
          this.pendingPqrs = response.data.filter((pqr: { status: string; }) => pqr.status === 'SIN RESOLVER');
          if (this.pendingPqrs.length > 0) {
            this.currentPqr = this.pendingPqrs[0];
          } else {
            this.currentPqr = null;
          }
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando PQRs pendientes:', error);
        this.loading = false;
      }
    });
  }

  nextPqr(): void {
    if (this.currentIndex < this.pendingPqrs.length - 1) {
      this.currentIndex++;
      this.currentPqr = this.pendingPqrs[this.currentIndex];
      this.solutionText = '';
    }
  }

  prevPqr(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.currentPqr = this.pendingPqrs[this.currentIndex];
      this.solutionText = '';
    }
  }

  submitSolution(): void {
    if (!this.solutionText.trim()) {
      alert('Por favor ingrese una solución antes de enviar');
      return;
    }

    this.loading = true;
    
    const solutionData = {
      id: this.currentPqr.id,
      solution: this.solutionText,
      employeeId: localStorage.getItem('employeeId') || null,
      status: 'RESUELTO'
    };

    // this.pqrService.resolvePQR(solutionData).subscribe({
    //   next: (response) => {
    //     this.loading = false;
        
    //     // Emitir el evento con la respuesta
    //     this.pqrResolved.emit(response);
        
    //     // Eliminar el PQR resuelto de la lista local
    //     this.pendingPqrs = this.pendingPqrs.filter(pqr => pqr.id !== this.currentPqr.id);
        
    //     if (this.pendingPqrs.length > 0) {
    //       // Ajustar el índice si es necesario
    //       if (this.currentIndex >= this.pendingPqrs.length) {
    //         this.currentIndex = this.pendingPqrs.length - 1;
    //       }
    //       this.currentPqr = this.pendingPqrs[this.currentIndex];
    //     } else {
    //       // No hay más PQRs pendientes
    //       this.currentPqr = null;
    //       this.close();
    //     }
        
    //     this.solutionText = '';
    //     alert('PQR resuelto correctamente');
    //   },
    //   error: (error) => {
    //     this.loading = false;
    //     console.error('Error al resolver PQR:', error);
    //     alert('Error al resolver el PQR. Por favor intente de nuevo.');
    //   }
    // });
  }

  getFormattedDate(dateString: string): string {
    if (!dateString) return 'Fecha no disponible';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  }
}