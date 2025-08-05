import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { AuthRequest } from '../../models/auth-request';

@Component({
  selector: 'app-login',
  standalone:false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  returnUrl: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    console.log("login objecct is created .....");
    
  }
  
  ngOnInit(): void {
    this.initializeForm();
    
    // Get return URL from route parameters or default to '/students/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/students/dashboard';
    
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }
  
  private initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const loginData: AuthRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };
      
      this.authService.login(loginData).subscribe({
        next: (response) => {
          // AuthService handles storing token and user data internally
          // Redirect to return URL or dashboard
          console.table(loginData);
          
          this.router.navigate([this.returnUrl]);
          this.isLoading = false;
        },
        error: (error) => {
          if (error.status === 401) {
            this.errorMessage = 'Invalid email or password. Please try again.';
          } else if (error.status === 404) {
            this.errorMessage = 'User not found. Please check your email.';
          } else {
            this.errorMessage = error.error?.message || 'Login failed. Please try again later.';
          }
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }
  
  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
  
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}