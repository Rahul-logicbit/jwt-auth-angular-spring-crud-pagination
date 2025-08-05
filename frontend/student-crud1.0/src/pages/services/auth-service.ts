// // services/auth.service.ts
// import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { isPlatformBrowser } from '@angular/common';
// import { BehaviorSubject, Observable, of } from 'rxjs';
// import { tap, catchError, map } from 'rxjs/operators';
// import { URLService } from './url-service';
// import { AuthRequest } from '../models/auth-request';
// import { AuthResponse } from '../models/auth-response';

// export interface User {
//   id: number;
//   name: string;
//   email: string;
//   course: string;
//   authorities?: { authority: string }[];
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private currentUserSubject = new BehaviorSubject<User | null>(null);
//   public currentUser$ = this.currentUserSubject.asObservable();
//   private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private http: HttpClient,
//     private urlService: URLService
//   ) {
//     this.loadUserFromStorage();
//   }

//   // Safe JSON parse helper
//   private safeJsonParse<T>(value: string | null): T | null {
//     if (!value || value === 'undefined') {
//       return null;
//     }
//     try {
//       return JSON.parse(value) as T;
//     } catch {
//       console.error('Failed to parse JSON:', value);
//       return null;
//     }
//   }

//   // Load user from localStorage
//   private loadUserFromStorage(): void {
//     if (!isPlatformBrowser(this.platformId)) {
//       return;
//     }
    
//     const token = localStorage.getItem('authToken');
//     const storedUser = localStorage.getItem('currentUser');
    
//     if (token && storedUser) {
//       const user = this.safeJsonParse<User>(storedUser);
//       if (user) {
//         this.currentUserSubject.next(user);
//         this.isAuthenticatedSubject.next(true);
//       } else {
//         // Clear invalid data
//         this.clearStorage();
//       }
//     } else {
//       this.clearStorage();
//     }
//   }

//   private clearStorage(): void {
//     if (isPlatformBrowser(this.platformId)) {
//       localStorage.removeItem('authToken');
//       localStorage.removeItem('currentUser');
//     }
//     this.currentUserSubject.next(null);
//     this.isAuthenticatedSubject.next(false);
//   }

//   // Login Method
//   login(credentials: { email: string; password: string }): Observable<AuthResponse> {
//     return this.http
//       .post<AuthResponse>(this.urlService.loginAPI, credentials)
//       .pipe(
//         tap(response => this.handleAuthResponse(response)),
//         catchError(error => {
//           console.error('Login failed:', error);
//           return of(error);
//         })
//       );
//   }

//   // Signup Method
//   signup(signUpData: AuthRequest): Observable<AuthResponse> {
//     return this.http
//       .post<AuthResponse>(this.urlService.signupAPI, signUpData)
//       .pipe(
//         tap(response => this.handleAuthResponse(response)),
//         catchError(error => {
//           console.error('Signup failed:', error);
//           return of(error);
//         })
//       );
//   }

//   // Handle authentication response
//   private handleAuthResponse(response: AuthResponse): void {
//     if (!isPlatformBrowser(this.platformId) || !response?.token) {
//       return;
//     }

//     // Create user object from response
//     const user: User = {
//       id: response.id,
//       email: response.email,
//       name: response.name,
//       course: response.course
//     };

//     // Store token and user data
//     localStorage.setItem('authToken', response.token);
//     localStorage.setItem('currentUser', JSON.stringify(user));
    
//     // Update subjects
//     this.currentUserSubject.next(user);
//     this.isAuthenticatedSubject.next(true);
//   }

//   // Logout Method
//   logout(): void {
//     this.clearStorage();
//   }

//   // Synchronous getters
//   getCurrentUser(): User | null {
//     return this.currentUserSubject.value;
//   }

//   getAuthToken(): string | null {
//     if (!isPlatformBrowser(this.platformId)) {
//       return null;
//     }
//     return localStorage.getItem('authToken');
//   }

//   // Observable getters
//   isAuthenticated$(): Observable<boolean> {
//     return this.isAuthenticatedSubject.asObservable();
//   }

//   // Simple logged-in check
//   isLoggedIn(): boolean {
//     const token = this.getAuthToken();
//     return !!token && this.isAuthenticatedSubject.value;
//   }
// }

// services/auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs'; // 1. Import throwError
import { tap, catchError } from 'rxjs/operators';
import { URLService } from './url-service';
import { AuthRequest } from '../models/auth-request';
import { AuthResponse } from '../models/auth-response';

export interface User {
  id: number;
  name: string;
  email: string;
  course: string;
  authorities?: { authority: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private urlService: URLService
  ) {
    this.loadUserFromStorage();
  }

  // Safe JSON parse helper
  private safeJsonParse<T>(value: string | null): T | null {
    if (!value || value === 'undefined') {
      return null;
    }
    try {
      return JSON.parse(value) as T;
    } catch {
      console.error('Failed to parse JSON:', value);
      return null;
    }
  }

  // Load user from localStorage
  private loadUserFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('currentUser');
    
    if (token && storedUser) {
      const user = this.safeJsonParse<User>(storedUser);
      if (user) {
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } else {
        // Clear invalid data
        this.clearStorage();
      }
    } else {
      this.clearStorage();
    }
  }

  private clearStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  // Login Method
  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(this.urlService.loginAPI, credentials)
      .pipe(
        tap(response => this.handleAuthResponse(response)),
        catchError(error => {
          console.error('Login failed:', error);
          return throwError(() => error); // 2. Re-throw the error
        })
      );
  }

  // Signup Method
  signup(signUpData: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.urlService.signupAPI, signUpData);
  }

  // Handle authentication response
  private handleAuthResponse(response: AuthResponse): void {
    if (!isPlatformBrowser(this.platformId) || !response?.token) {
      return;
    }

    // Create user object from response
    const user: User = {
      id: response.id,
      email: response.email,
      name: response.name,
      course: response.course
    };

    // Store token and user data
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Update subjects
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  // Logout Method
  logout(): void {
    this.clearStorage();
  }

  // Synchronous getters
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getAuthToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    return localStorage.getItem('authToken');
  }

  // Observable getters
  isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  // Simple logged-in check
  isLoggedIn(): boolean {
    const token = this.getAuthToken();
    return !!token && this.isAuthenticatedSubject.value;
  }
}