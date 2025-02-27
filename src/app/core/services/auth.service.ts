import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { IAuth, IAuthResponse, ICredentials } from '../interfaces/auth.interface';
import { environment } from '../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private toastr: ToastrService = inject(ToastrService);
  private localStorage = inject(LocalStorageService);

  private readonly apiUrl = environment.API_URL;
  private authStatus$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.initializeAuthStatus();
  }

  private initializeAuthStatus(): void {
    const isLoggedIn = !!this.localStorage.get('isLoggedIn');
    this.authStatus$.next(isLoggedIn);
  }

  login(credentials: IAuth): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(`${this.apiUrl}auth/login`, credentials).pipe(
      tap((response) => {
        this.localStorage.set('isLoggedIn', String(response.success));
        this.authStatus$.next(true);
      }),
      catchError((error) => {
        if (error?.error === 'wrong credentials' || error?.status === 401) {
          this.toastr.warning('User is not defined or password is incorrect');
        } else {
          this.toastr.error('Error in login. Please try again later.');
        }

        return throwError(() => new Error(error?.error?.message || 'Login failed'));
      })
    );
  }

  logout(): void {
    this.localStorage.remove('isLoggedIn');
    this.authStatus$.next(false);
    this.router.navigate(['/login']);
  }

  register(credentials: ICredentials): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(`${this.apiUrl}auth/register`, credentials).pipe(
      tap((response) => {
        this.localStorage.set('isLoggedIn', String(response.success));
        this.authStatus$.next(true);
        this.toastr.success('Registration completed successfully');
      }),
      catchError((error) => {
        if (error?.error === 'user already exists' || error?.status === 401) {
          this.toastr.warning('A user with this email is already registered');
        } else {
          this.toastr.error('Error while registering. Please try again later.');
        }

        return throwError(() => new Error(error?.error?.message || 'Registration failed'));
      })
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.authStatus$.asObservable();
  }
}
