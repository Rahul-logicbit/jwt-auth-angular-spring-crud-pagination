import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { StudentDetailComponent } from './student-detail/student-detail.component';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentModuleRouting } from './student-module-routing';
import { HttpClientModule } from '@angular/common/http';
import { SignupComponent } from './signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditStudentComponent } from './edit-student/edit-student.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';


@NgModule({
  declarations: [
    StudentListComponent,
    StudentDetailComponent,
    SignupComponent,
    EditStudentComponent,
    LoginComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    StudentModuleRouting,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class StudentModuleModule { 

  constructor(){
    console.log(" student module object is created ====");
  }
}
