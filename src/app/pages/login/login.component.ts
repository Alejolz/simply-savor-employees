import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/users/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  onSubmit(event: Event) {
    event.preventDefault(); // Evita refresh del navegador
    
    const form = event.target as HTMLFormElement;

    // ✅ Validación nativa del navegador
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Obtener valores de los inputs
    const email = (form.querySelector('#email') as HTMLInputElement).value;
    const password = (form.querySelector('#password') as HTMLInputElement).value;

    this.isLoading = true;
    this.errorMessage = '';

    this.userService.login(email, password).subscribe({
      next: (res) => {
        if (res.status === 200) {
          console.log('✅ Login exitoso');
          this.router.navigate(['/dashboard']);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error en login:', err);
        this.errorMessage = 'Correo o contraseña incorrectos';
        this.isLoading = false;
      }
    });
  }
}