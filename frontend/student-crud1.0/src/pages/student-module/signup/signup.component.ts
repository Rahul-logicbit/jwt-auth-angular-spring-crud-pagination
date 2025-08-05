// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthService } from '../../services/auth-service';
// import { AuthRequest } from '../../models/auth-request';

// // Custom Validator for password matching
// export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
//   const password = control.get('password')?.value;
//   const confirmPassword = control.get('confirmPassword')?.value;
//   return password === confirmPassword ? null : { passwordsMismatch: true };
// }

// @Component({
//   selector: 'app-signup',
//   standalone:false,
//   templateUrl: './signup.component.html',
//   styleUrls: ['./signup.component.scss']
// })
// export class SignupComponent implements OnInit {
//   signupForm!: FormGroup;
//   isLoading = false;
//   apiError: string | null = null;
//   passwordVisible = false;
//   showSuccess = false;

//   currentStep = 1;
//   stepTitles = ['Personal Details', 'Account Credentials', 'Confirm & Create'];

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.signupForm = this.fb.group({
//       name: ['', [Validators.required, Validators.minLength(2)]],
//       course: ['', [Validators.required]],
//       passwordGroup: this.fb.group({
//         email: ['', [Validators.required, Validators.email]],
//         password: ['', [Validators.required, Validators.minLength(6)]],
//         confirmPassword: ['', [Validators.required]]
//       }, { validators: passwordMatchValidator })
//     });
//   }

//   get name() { return this.signupForm.get('name'); }
//   get course() { return this.signupForm.get('course'); }
//   get passwordGroup() { return this.signupForm.get('passwordGroup'); }
//   get email() { return this.passwordGroup?.get('email'); }
//   get password() { return this.passwordGroup?.get('password'); }
//   get confirmPassword() { return this.passwordGroup?.get('confirmPassword'); }

//   nextStep(): void {
//     if (this.isStepInvalid()) {
//       return;
//     }
//     if (this.currentStep < 3) {
//       this.currentStep++;
//     }
//   }

//   prevStep(): void {
//     if (this.currentStep > 1) {
//       this.currentStep--;
//     }
//   }

//   isStepInvalid(): boolean {
//     if (this.currentStep === 1) {
//       // Fixed: Convert to boolean using !!
//       return !!(this.name?.invalid || this.course?.invalid);
//     }
//     if (this.currentStep === 2) {
//       this.email?.markAsTouched();
//       this.password?.markAsTouched();
//       // Fixed: Convert to boolean using !!
//       return !!(this.email?.invalid || this.password?.invalid);
//     }
//     return false;
//   }

//   onSubmit(): void {
//     if (this.signupForm.invalid) {
//       this.signupForm.markAllAsTouched();
//       return;
//     }

//     this.isLoading = true;
//     this.apiError = null;

//     const formValue = this.signupForm.getRawValue();

//     const requestData: AuthRequest = {
   
//       email: formValue.passwordGroup.email,
//       password: formValue.passwordGroup.password
//     };

//     this.authService.signup(requestData).subscribe({
//       next: (response) => {
//         this.isLoading = false;
//         this.showSuccess = true;
//         // Redirect to dashboard after successful signup
//         setTimeout(() => {
//           this.router.navigate(['/students/login']);
//         }, 2500);
//       },
//       error: (err) => {
//         this.isLoading = false;
//         this.apiError = err.error?.message || 'An unknown error occurred. Please try again.';
//       }
//     });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { SignUpRequest } from '../../models/signup-request';

// Custom Validator for password matching
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  isLoading = false;
  apiError: string | null = null;
  showSuccess = false;
  passwordVisible = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    console.log("student object is created ......");
    
  }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      course: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  // Getters for easy access in the template
  get name() { return this.signupForm.get('name'); }
  get course() { return this.signupForm.get('course'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.apiError = null;

    const requestData: SignUpRequest = {
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
      course:this.signupForm.value.course,
      name:this.signupForm.value.name
    };

    this.authService.signup(requestData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.showSuccess = true; // Show success message
        // Redirect to login after a short delay
        setTimeout(() => {
          this.router.navigate(['/students/login']);
        }, 2500);
      },
      error: (err) => {
        this.isLoading = false;
        this.apiError = err.error?.message || 'An unknown error occurred. Please try again.';
      }
    });
  }
}