  
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../../services/student.service'; 

@Component({
  selector: 'app-student-list',
  standalone: false,
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {

  public students: any[] = []; 
  public isLoading: boolean = true;
  public errorMessage: string | null = null;

  constructor(
    private studentService: StudentService,
    private router: Router
  ) {
    console.log("student-list component object is created");
  }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.studentService.getAllStudents().subscribe({
      next: (data) => {
        this.students = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = "Failed to load students. Please try again later.";
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  editStudent(id: number): void {
    this.router.navigate(['/students/edit' , id]);
  }

  deleteStudent(id: number): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(id).subscribe({
        next: () => {
          alert('Student deleted successfully!');
          this.loadStudents();
        },
        error: (err) => {
          alert('Failed to delete student.');
          console.error(err);
        }
      });
    }
  }
}