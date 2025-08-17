import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PqrService {
  private baseUrl = environment.apiUrl + '/dev';

  constructor(private http: HttpClient) { }


  getAllPQR(): Observable<any> {
    return this.http.get(`${this.baseUrl}/employees/get-all-pqr`);
  }
}