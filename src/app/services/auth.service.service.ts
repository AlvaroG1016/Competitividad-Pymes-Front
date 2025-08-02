import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiAuth = environment.apiUrl + 'Auth/Login'; 
  private apiRegister = environment.apiUrl + 'Empresa/CrearEmpresa';
  private localStorageToken = environment.localStoragetoken;
  private isLoggedIn = false;

  constructor(private http: HttpClient, private router: Router) {}

  async login(username: string, password: string): Promise<any> {
    const body = { Correo: username, Password: password};
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    const response = await lastValueFrom(this.http.post<any>(this.apiAuth, body, httpOptions));
    return response;
  }
  async register(body:any): Promise<any> {
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    const response = await lastValueFrom(this.http.post<any>(this.apiRegister, body, httpOptions));
    return response;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.localStorageToken);
    if (!token) return false;

    const isValid = !this.isTokenExpired(token);
    this.isLoggedIn = isValid;
    return isValid;
  }

  private isTokenExpired(token: string): boolean {
    try {
      let decodedToken = jwtDecode(token);
      
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp !== undefined && decodedToken.exp < currentTime;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return true;
    }
  }
  setAuthentication(status: boolean): void {
    this.isLoggedIn = status;
  }

  logout(): void {

    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
