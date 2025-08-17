import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { Employee, LoginResponse } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // URL base definida correctamente
  private baseUrl = environment.apiUrl + '/dev';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  login(email: string, password: string): Observable<HttpResponse<any>> {
    const params = new HttpParams()
      .set('email', email)
      .set('password', password);

    return this.http.get<LoginResponse>(`${this.baseUrl}/employees/login`, { params, observe: 'response' })
      .pipe(
        map((response: HttpResponse<any>) => {
          // Si la respuesta es exitosa y contiene datos de empleado
          if (response.status === 200 && response.body && response.body.data) {
            // Extrae los datos de empleado y la clave de sesión
            const employeeData = response.body.data.employee;
            const sessionKey = response.body.data.sessionKey;
            
            // Almacena en el servicio de autenticación
            this.authService.setEmployeeSession(employeeData, sessionKey);
          }
          return response;
        })
      );
  }

  registerEmployee(employeeData: any): Observable<any> {
    const url = `${this.baseUrl}/employees/register`;
    
    // Construimos el payload según la estructura requerida
    const payload = {
      userName: employeeData.userName,
      password: employeeData.employeePassword, // Nota el cambio de nombre de campo
      employeeEmail: employeeData.employeeEmail,
      identificationType: employeeData.identificationType,
      employeeIdentification: employeeData.employeeIdentification,
      employeePhone: employeeData.employeePhone,
      role: employeeData.employeeRole // Nota el cambio de nombre de campo
    };
    
    return this.http.post(url, payload);
  }
}
