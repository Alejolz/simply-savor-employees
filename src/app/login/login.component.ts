import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/users/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router) {}

  onSubmit() {
    this.userService.login(this.email, this.password).subscribe({
      next: (res) => {
        if (res.status === 200) {
          console.log('✅ Login exitoso');
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        console.error('❌ Error en login:', err);
        this.errorMessage = 'Correo o contraseña incorrectos';
      }
    });
  }
}