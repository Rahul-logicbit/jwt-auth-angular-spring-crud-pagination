// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { StudentListComponent } from './student-list/student-list.component';
// import { StudentDetailComponent } from './student-detail/student-detail.component';
// import { SignupComponent } from './signup/signup.component';
// import { EditStudentComponent } from './edit-student/edit-student.component';
// import { LoginComponent } from './login/login.component';
// import { DashboardComponent } from './dashboard/dashboard.component';

// const routes: Routes = [
//   // When navigating to '/students', redirect to '/students/list'
//   {
//     path: '',
//     redirectTo: 'list',
//     pathMatch: 'full'
//   },
//   // The route for the student list, e.g., '/students/list'
//   {
//     path: 'list',
//     component: StudentListComponent,
//   },
//   // The route for a single student's detail
//   // This tells Angular that an 'id' parameter is expected in the URL
//   {
//     path: 'detail/:id', // ✅ CORRECTED: Changed from 'detail' to 'detail/:id'
//     component: StudentDetailComponent,
//   }
//   ,
//   {
//     path: 'signup',
//     component: SignupComponent,
//   },
//   {
//     path: 'edit/:id',
//     component: EditStudentComponent,
//   },
//   {
//     path: 'login',
//     component: LoginComponent,
//   }
//   ,
//   {
//     path: 'dashboard',
//     component: DashboardComponent,
//   }
// ];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })
// export class StudentModuleRouting {
//   constructor() {
//     console.log("student-module routing object is created");
//   }
// }


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { StudentDetailComponent } from './student-detail/student-detail.component';
import { EditStudentComponent } from './edit-student/edit-student.component';

import { AuthGuard } from '../services/auth.guard'; // Import your guard
import { StudentListComponent } from './student-list/student-list.component';

const routes: Routes = [
  // Public routes
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // Protected routes
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard] },
     {
    path: 'list',
    component: StudentListComponent,
    canActivate: [AuthGuard]
  },
  
  {
    path: 'detail/:id',
    component: StudentDetailComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: 'edit/:id',
    component: EditStudentComponent,
    canActivate: [AuthGuard] 
  },

  // Default redirect
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentModuleRouting { }

